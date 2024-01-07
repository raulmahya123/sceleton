const Joi = require('joi')
const {
  failActionResponse,
  preResponseExtension,
  customScopeByRoute,
} = require('../../../../utils')
const { getFeedbacksExternal } = require('../handlers')

module.exports = [
  {
    method: ['GET'],
    path: '/external/feedbacks/user-answer',
    handler: getFeedbacksExternal,
    options: {
      tags: ['api', 'mdl', 'saas', 'external'],
      description: 'API to GET COURSE LIST [SAAS]',
      auth: false,
      ext: {
        onPreResponse: {
          method: customScopeByRoute,
        },
        onPostResponse: {
          method: preResponseExtension,
        },
      },
      validate: {
        query: Joi.object({
          page: Joi.number().description('Content Pagination Page Default 1').default(1),
          page_size: Joi.number()
            .description('Content Pagination Page Size Default 10')
            .default(10),
          id: Joi.number().integer().description('Content ID'),
          content_id: Joi.number().integer().description('Content ID'),
          content_batch: Joi.number().integer().description('Content Batch'),
          content: Joi.number().integer().description('Content Batch'),
          nik: Joi.string().description('NIK').allow(null, ''),
          is_telkom_group: Joi.boolean().optional().description('Is Telkom Group'),
        }),
        failAction: failActionResponse,
      },
    },
  },
]
