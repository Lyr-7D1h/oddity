import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// console.log(ClassicEditor.builtinPlugins.map((plugin) => plugin.pluginName))
export default ({ onChange, data }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      onChange={(_, editor) => onChange(editor.getData())}
      data={data || ''}
      config={{
        removePlugins: ['ImageUpload'],
        toolbar: [
          'heading',
          // "alignment",
          // "|",
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'blockQuote',
        ],
      }}
    />
  )
}
