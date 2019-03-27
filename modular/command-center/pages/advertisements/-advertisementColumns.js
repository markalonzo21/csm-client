export default [
  {
    title: 'Image',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: 'Link',
    dataIndex: 'link'
  },
  {
    title: 'Placement',
    dataIndex: 'placement'
  },
  {
    title: 'Actions',
    dataIndex: '_id',
    scopedSlots: { customRender: 'actions' }
  }
]
