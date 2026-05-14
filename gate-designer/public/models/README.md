Place downloaded GLB assets at these paths:

```text
public/models/car.glb
public/models/house.glb
```

The 3D scene loads `/models/car.glb` and `/models/house.glb` at runtime. If either file is unavailable, the app silently keeps a lightweight in-scene fallback model so the configurator remains usable.
