import { registerBones } from "boneyard-js/react";

const boneModules = import.meta.glob("./*.bones.json", { eager: true });

const registeredBones = Object.fromEntries(
  Object.entries(boneModules)
    .map(([filePath, module]) => {
      const match = filePath.match(/^\.\/(.+)\.bones\.json$/);

      if (!match) {
        return null;
      }

      return [match[1], module.default ?? module];
    })
    .filter(Boolean),
);

registerBones(registeredBones);
