# Design Spec

## Features to implement:
* Basic Shapes
* Undo/Redo
* Grouping/Ungrouping
* Arrows


* Stroke
* Fill
* Other Shape Properties


* Move
* Rotate
* Delete


* Snap to Grid
* Bounding Box
* Pages
* Templates
* Color Palettes

## Frontend
Main App container will have a Canvas. The Canvas will contain a list of groups as determined by the backend. The frontend will send all click events to the backend which will return the new state of the canvas to be re-rendered.

## Backend
Redux state will be designed as follows:

```javascript
{
  zIndexArray:[group_id, group_id, group_id],
  selectedArray:[group_id, group_id, group_id],
  drawing:
  {
    id:
    {
      type: "group"
      zIndexArray: [id, id, id]
    },
    id:
    {
      type: "shape",
      subtype: "circle",
      stroke: "",
      fill: ""
      ...
    },
    id:
    {
      type: "group"
      zIndexArray: [id, id]
    },
    id:
    {
      type: "shape",
      subtype: "arrow",
      stroke: "",
      fill: ""
      ...
    },
    ...
  },
  colorPalettes: {}
  templates: {}
  ...
}
```

Click events will be passed to the backend and will return a list of groups to be rendered by the frontend.
