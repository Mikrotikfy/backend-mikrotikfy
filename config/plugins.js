module.exports = ({ env }) => ({
  // ..
  'transformer': {
    enabled: true,
    config: {
      prefix: '/api/',
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      }
    }
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
        sizeLimit: 250 * 1024 * 1024 // 256mb in bytes
      },
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  // ..
});