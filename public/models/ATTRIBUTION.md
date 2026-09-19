# Anatomy model attribution

The anatomy data in this directory is adapted from **BodyParts3D 4.0**, © The Database Center for Life Science, and is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

- Official license: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Source geometry: `isa_BP3D_4.0_obj_99.zip`
- Publication: Mitsuhashi et al. (2009), “BodyParts3D: 3D structure database for anatomical concepts.” https://doi.org/10.1093/nar/gkn613

## Adaptations

The browser-ready data was derived from the assets distributed by [ashemag/human-atlas](https://github.com/ashemag/human-atlas). That project converted the source from millimeters/Z-up to meters/Y-up, translated it to rest on the stage, simplified each structure with a 0.2% relative error limit, quantized normals to signed 16-bit values, and packed the geometry into binary chunks.

This repository further filters that atlas to 450 meshes used by the application: the muscular system, mapped muscle structures classified elsewhere in the source atlas, and the skull, facial bones, and teeth. The retained geometry was repacked into six binary chunks without further geometric modification.

The `human-atlas` application code is distributed under the MIT License. Its license notice is preserved in [`LICENSE-human-atlas.txt`](LICENSE-human-atlas.txt).

BodyParts3D is an adult male reference anatomy based on TARO MRI and anatomical illustration refinements. It does not represent every human structure or variation. This application is educational and is not a diagnostic or surgical tool.
