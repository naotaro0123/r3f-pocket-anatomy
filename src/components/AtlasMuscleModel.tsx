import { Html } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MUSCLES, type MuscleId } from "../data/muscles";

type AtlasMuscleModelProps = ThreeElements["group"] & {
  onHighlightMuscle?: (muscleId: MuscleId | null) => void;
  selectedMuscleId?: MuscleId | null;
  url: string;
};

type AtlasPart = {
  id: string;
  name: string;
  system: string;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [[number, number, number], [number, number, number]];
};

type AtlasConcept = {
  id: string;
  elements: string[];
};

type AtlasChunk = {
  url: string;
  bytes: number;
  gzip?: string;
};

type Atlas = {
  parts: AtlasPart[];
  concepts: AtlasConcept[];
  chunks: AtlasChunk[];
};

type GeometryGroup = {
  geometry: BufferGeometry;
  key: string;
  muscleId: MuscleId | null;
  system: string;
};

const HIGHLIGHT_COLOR = "#fb7185";
const HIGHLIGHT_BASE_COLOR = "#fda4af";
const HIGHLIGHT_EMISSIVE_INTENSITY = 1.8;
const DEFAULT_MUSCLE_COLOR = "#a85b50";
const OTHER_GROUP = "__other";
const SYSTEM_COLORS: Record<string, string> = {
  arterial: "#c05245",
  cardiac: "#b96760",
  connective: "#aec3bb",
  digestive: "#b8916b",
  endocrine: "#c5a09a",
  integumentary: "#ba9b7d",
  lymphatic: "#879f7c",
  muscular: DEFAULT_MUSCLE_COLOR,
  nervous: "#d8b565",
  reproductive: "#bda098",
  respiratory: "#b98991",
  sensory: "#b0c8ce",
  skeletal: "#e2d9ba",
  urinary: "#b47961",
  venous: "#527c9f",
};
const CONCEPT_IDS_BY_MUSCLE_ID: Partial<Record<MuscleId, readonly string[]>> = {
  Muscle_Chest: ["FMA34686"],
  Muscle_Deltoid: ["FMA34676"],
  Muscle_Biceps: ["FMA37682", "FMA37683"],
  Muscle_ForearmFlexors: ["FMA38459", "FMA38469", "FMA38478", "FMA38481", "FMA38615", "FMA38616"],
  Muscle_Obliques: ["FMA13335"],
  Muscle_Quads: ["FMA22429"],
  Muscle_TibialisAnterior: ["FMA22532"],
  Muscle_Trapezius: ["FMA32529"],
  Muscle_LatissimusDorsi: ["FMA13379", "FMA13402", "FMA22702", "FMA22703", "FMA22709"],
  Muscle_TricepsBrachii: ["FMA37692", "FMA37693", "FMA37694"],
  Muscle_GluteusMaximus: ["FMA22314"],
};
const MUSCLE_COLOR_BY_ID = new Map(MUSCLES.map((muscle) => [muscle.id, muscle.color]));

async function decodeModelResponse(response: Response, expectedBytes: number, compressed: boolean) {
  if (!response.ok) {
    throw new Error(`解剖モデルを読み込めませんでした (${response.status})。`);
  }

  const payload = await response.arrayBuffer();
  const signature = new Uint8Array(payload, 0, Math.min(2, payload.byteLength));
  const isGzip = compressed && signature[0] === 0x1f && signature[1] === 0x8b;
  const buffer = isGzip
    ? await new Response(
        new Blob([payload]).stream().pipeThrough(new DecompressionStream("gzip")),
      ).arrayBuffer()
    : payload;

  if (buffer.byteLength !== expectedBytes) {
    throw new Error("解剖モデルのデータが不完全です。ページを再読み込みしてください。");
  }

  return buffer;
}

function resolveAtlasAssetUrl(assetUrl: string, atlasUrl: string) {
  const atlasDirectoryUrl = new URL(".", atlasUrl);
  const path = assetUrl.startsWith("/models/") ? assetUrl.slice("/models/".length) : assetUrl;
  return new URL(path, atlasDirectoryUrl).toString();
}

function mapPartsToMuscles(atlas: Atlas) {
  const concepts = new Map(atlas.concepts.map((concept) => [concept.id, concept.elements]));
  const muscleByPartId = new Map<string, MuscleId>();

  for (const [muscleId, conceptIds] of Object.entries(CONCEPT_IDS_BY_MUSCLE_ID) as [
    MuscleId,
    readonly string[],
  ][]) {
    for (const conceptId of conceptIds) {
      for (const partId of concepts.get(conceptId) ?? []) {
        muscleByPartId.set(partId, muscleId);
      }
    }
  }

  return muscleByPartId;
}

function isHeadSkeleton(part: AtlasPart) {
  if (part.system !== "skeletal" || part.bounds[0][1] < 1.4) {
    return false;
  }

  return (
    !/(cartilage|gingiva|hyoid|intervertebral|vertebra)/i.test(part.name) &&
    part.name !== "Atlas" &&
    part.name !== "Axis"
  );
}

async function loadAtlasGeometries(url: string, signal: AbortSignal) {
  const atlasResponse = await fetch(url, { signal });
  if (!atlasResponse.ok) {
    throw new Error(`解剖モデルのカタログを読み込めませんでした (${atlasResponse.status})。`);
  }

  const atlas = (await atlasResponse.json()) as Atlas;
  const muscleByPartId = mapPartsToMuscles(atlas);
  const includedParts = atlas.parts.filter(
    (part) => part.system === "muscular" || muscleByPartId.has(part.id) || isHeadSkeleton(part),
  );
  const partsByChunk = new Map<number, AtlasPart[]>();
  for (const part of includedParts) {
    const parts = partsByChunk.get(part.chunk) ?? [];
    parts.push(part);
    partsByChunk.set(part.chunk, parts);
  }
  const geometriesByGroup = new Map<string, BufferGeometry[]>();
  const groupDetails = new Map<string, Pick<GeometryGroup, "muscleId" | "system">>();

  try {
    await Promise.all(
      [...partsByChunk].map(async ([chunkIndex, parts]) => {
        const chunk = atlas.chunks[chunkIndex];
        const useGzip = Boolean(chunk.gzip && typeof DecompressionStream !== "undefined");
        const assetUrl = resolveAtlasAssetUrl(useGzip ? chunk.gzip! : chunk.url, atlasResponse.url);
        const response = await fetch(assetUrl, { signal });
        const buffer = await decodeModelResponse(response, chunk.bytes, useGzip);

        for (const part of parts) {
          const geometry = new BufferGeometry();
          geometry.setAttribute(
            "position",
            new BufferAttribute(new Float32Array(buffer, part.positions, part.vertexCount * 3), 3),
          );
          geometry.setAttribute(
            "normal",
            new BufferAttribute(
              new Int16Array(buffer, part.normals, part.vertexCount * 3),
              3,
              true,
            ),
          );
          geometry.setIndex(
            new BufferAttribute(new Uint32Array(buffer, part.indices, part.indexCount), 1),
          );

          const muscleId = muscleByPartId.get(part.id) ?? null;
          const group = `${part.system}:${muscleId ?? OTHER_GROUP}`;
          const geometries = geometriesByGroup.get(group) ?? [];
          geometries.push(geometry);
          geometriesByGroup.set(group, geometries);
          groupDetails.set(group, { muscleId, system: part.system });
        }
      }),
    );

    return [...geometriesByGroup].map(([group, geometries]) => {
      const geometry = mergeGeometries(geometries, false);
      if (!geometry) {
        throw new Error("解剖モデルのジオメトリを結合できませんでした。");
      }
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      return {
        geometry,
        key: group,
        ...groupDetails.get(group)!,
      };
    });
  } finally {
    for (const geometries of geometriesByGroup.values()) {
      geometries.forEach((geometry) => geometry.dispose());
    }
  }
}

export function AtlasMuscleModel({
  onHighlightMuscle,
  selectedMuscleId,
  url,
  ...props
}: AtlasMuscleModelProps) {
  const [geometryGroups, setGeometryGroups] = useState<GeometryGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let loadedGeometries: GeometryGroup[] = [];

    setGeometryGroups([]);
    setError(null);
    loadAtlasGeometries(url, abortController.signal)
      .then((groups) => {
        loadedGeometries = groups;
        if (abortController.signal.aborted) {
          groups.forEach(({ geometry }) => geometry.dispose());
          return;
        }
        setGeometryGroups(groups);
      })
      .catch((loadError: unknown) => {
        if (!abortController.signal.aborted) {
          setError(
            loadError instanceof Error ? loadError.message : "解剖モデルの読み込みに失敗しました。",
          );
        }
      });

    return () => {
      abortController.abort();
      loadedGeometries.forEach(({ geometry }) => geometry.dispose());
    };
  }, [url]);

  if (error) {
    return (
      <Html center>
        <div role="alert" className="muscle-callout">
          {error}
        </div>
      </Html>
    );
  }

  const highlightedMuscleId =
    selectedMuscleId === "Muscle_Abs" ? "Muscle_Obliques" : selectedMuscleId;

  return (
    <group {...props}>
      {geometryGroups.map(({ geometry, key, muscleId, system }) => {
        const isSelected = muscleId !== null && muscleId === highlightedMuscleId;
        const isBodySurface = system === "integumentary";

        return (
          <mesh
            key={key}
            geometry={geometry}
            onPointerOver={
              muscleId
                ? (event: ThreeEvent<PointerEvent>) => {
                    event.stopPropagation();
                    onHighlightMuscle?.(muscleId);
                  }
                : undefined
            }
            onPointerOut={
              muscleId
                ? (event: ThreeEvent<PointerEvent>) => {
                    event.stopPropagation();
                    onHighlightMuscle?.(null);
                  }
                : undefined
            }
          >
            <meshStandardMaterial
              color={
                isSelected
                  ? HIGHLIGHT_BASE_COLOR
                  : muscleId
                    ? (MUSCLE_COLOR_BY_ID.get(muscleId) ?? DEFAULT_MUSCLE_COLOR)
                    : (SYSTEM_COLORS[system] ?? "#aebbb8")
              }
              depthWrite={!isBodySurface}
              emissive={isSelected ? HIGHLIGHT_COLOR : "#000000"}
              emissiveIntensity={isSelected ? HIGHLIGHT_EMISSIVE_INTENSITY : 0}
              metalness={isSelected ? 0.08 : 0.04}
              opacity={isBodySurface ? 0.1 : 1}
              roughness={isSelected ? 0.28 : 0.58}
              side={DoubleSide}
              transparent={isBodySurface}
            />
          </mesh>
        );
      })}
    </group>
  );
}
