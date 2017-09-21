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

# Redux-redo storing only the diff

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

# OR - Linked List Solution 

```javascript
// add circle

{
	root: 0
	tail: 0
	nodes:
	{
		0:
	 	{
			type: circle
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
			birth: 0
			death: -infinity
			prev: null
			next: null
		}
	}
}

// add square
{
	root: 0
	tail: 1
	nodes:
	{
		  0:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
			birth: 0,
			death: -infinity,
			prev: null,
			next: 1
		},
      1:
	 	{
			type: square,
      id: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
			birth: 1,
			death: -infinity,
			prev: 0,
			next: null
		}
	}
}

// move square to back
{
	root: 2
	tail: 1
	nodes:
	{
      2:
	 	{
			type: square,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 2,
			death: -infinity,
			prev: null,
			next: 0
		}
		  0:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: -1,
			birth: 0,
			death: -infinity,
			prev: 2,
			next: 1
		},
      1:
	 	{
			type: square,
      id: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 1,
			death: 2,
			prev: 0,
			next: null
		}
	}
}

// group circle and square

// SOLUTION_1: Give everything a group number, kill previous node and attach new node with group number:
{
	root: 2
	tail: 1
	nodes:
	{
      2:
	 	{
			type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 2,
			death: 3,
			prev: null,
			next: 3
		},
      3:
    {
      type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 3,
      next: 0
    }
		  0:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: -1,
			birth: 0,
			death: 3,
			prev: 3,
			next: 4
		},
      4:
    {
      type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 0,
      next: 1
    },
      1:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 1,
			death: 2,
			prev: 4,
			next: null
		}
	}
  groups:
  {
      0:
      {
        group_num: -1,
        birth: 3,
        death: -infinity
      }  
  }
}

// add triangle
{
	root: 2
	tail: 1
	nodes:
	{
      2:
	 	{
			type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 2,
			death: 3,
			prev: null,
			next: 3
		},
      3:
    {
      type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 3,
      next: 0
    }
		  0:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: -1,
			birth: 0,
			death: 3,
			prev: 3,
			next: 4
		},
      4:
    {
      type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 0,
      next: 1
    },
      1:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 1,
			death: 2,
			prev: 4,
			next:  5
		},
    5:
    {
			type: triangle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57rrr',
      group_num: -1,
			birth: 4,
			death: -infinity,
			prev: 1,
			next: null
		},
	}
  groups:
  {
      0:
      {
        group_num: -1,
        birth: 3,
        death: -infinity
      }  
  }
}

// group group and triangle
{
	root: 2
	tail: 1
	nodes:
	{
      2:
	 	{
			type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 2,
			death: 3,
			prev: null,
			next: 3
		},
      3:
    {
      type: circle,
      guid: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 3,
      next: 0
    }
		  0:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: -1,
			birth: 0,
			death: 3,
			prev: 3,
			next: 4
		},
      4:
    {
      type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57efg',
      group_num: 0,
      birth: 3,
      death: -infinity,
      prev: 0,
      next: 1
    },
      1:
	 	{
			type: circle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57dbc',
      group_num: -1,
			birth: 1,
			death: 2,
			prev: 4,
			next:  5
		},
    5:
    {
			type: triangle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57rrr',
      group_num: -1,
			birth: 4,
			death: 5,
			prev: 1,
			next: 6
		},
    6:
    {
			type: triangle,
      id: '205def87-fea1-4ece-bc4a-bb3174f57rrr',
      group_num: 1,
			birth: 5,
			death: -infinity,
			prev: 5,
			next: null
		},
	}
  groups:
  {
      0:
      {
        group_id: 0
        group_num: -1,
        birth: 3,
        death: 5
      } ,
      2:
      {
        group_id: 0
        group_num: 1,
        birth: 5,
        death: -infinity
      } ,
      1:
      {
        group_id: 1
        group_num: -1,
        birth: 5,
        death: -inifinty
      }
  }
}

// if we want selection, add selection: {} like groups: {}

// SOLUTION_2: Forrest of groups (?):

```

Click events will be passed to the backend and will return a list of groups to be rendered by the frontend.
