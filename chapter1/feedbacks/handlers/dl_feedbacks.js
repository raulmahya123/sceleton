const {
  responseFailed,
  responseSuccess,
  customScopeByRoute,
} = require('../../../../utils')
const { GetfindFeedbacks } = require('../helpers')
const getFeedbacksExternal = async (request, h) => {
  try {
    const check = await customScopeByRoute(request, h)
    if (check.statusCode) {
      return responseFailed(check.source.message, check.statusCode)
    }
    const coursesExternal = await GetfindFeedbacks(request.query)

    return responseSuccess(
      h,
      'Get List Answer Feedback of Question Survey',
      coursesExternal,
      200,
    )
  } catch (error) {
    return responseFailed(error, error.errorCode)
  }
}
module.exports = {
  getFeedbacksExternal,
}
