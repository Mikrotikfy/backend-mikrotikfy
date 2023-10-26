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
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["role", "cities", 'tickets', 'ticketdetails', 'clienttypes', 'materialhistories', 'menu', 'staticips', 'debtmovements', 'offermovements', 'ticketstechnician', 'telegramchatid', 'phone', 'invoice_movements', 'preferredcity'],
      },
    },
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::service.service",
          modelName: "service",
          transliterate: false,
          fuzzysortOptions: {
            characterLimit: 50,
            threshold: -100,
            limit: 50,
            keys: [
              {
                name: "address",
                weight: 600,
              },
            ],
          },
        },
      ],
    },
  },

});