export default [
  {
    title: 'Title',
    dataIndex: 'title'
  },
  {
    title: 'Slug',
    dataIndex: 'slug'
  },
  {
    title: 'Description',
    dataIndex: 'description'
  },
  {
    title: 'Media',
    dataIndex: 'media',
    scopedSlots: { customRender: 'media' }
  },
  {
    title: 'Actions',
    dataIndex: '_id',
    scopedSlots: { customRender: 'actions' }
  }
]
