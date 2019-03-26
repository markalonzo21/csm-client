export default [
  {
    title: 'Image',
    dataIndex: 'image',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: 'Actions',
    dataIndex: '_id',
    scopedSlots: { customRender: 'actions' }
  }
]
