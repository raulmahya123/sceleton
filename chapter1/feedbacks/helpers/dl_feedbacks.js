const { Model } = require('objection')
const GetfindFeedbacks = async (datas) => {
  try {
    const { page, page_size, content_id, content_batch, content, nik, is_telkom_group } =
      datas
    let query
    if (content_id || content_batch || content) {
      query = `select x.user_id, x.nik, x.full_name, x.created_at, concat('[',string_agg(distinct ('{ question_id: '||x.question_id||',question_digiverse_id: '||COALESCE(x.digiverse_id, 0)||',answer: '||COALESCE(x.answer, 0)||',answer_text: "'||COALESCE(x.answer_text, '')||'"}')::varchar,','),']') user_answer from ( select fua.user_id, u.full_name, u.nik, fua.created_at, fua.created_by, fua.content_type, fua.content_id, fua.content_batch, fua.feedback_content_id as question_id, fua.digiverse_id, fua.answer, fua.answer_text from feedback_user_answer fua join users u on u.id = fua.user_id where fua.content_type = ${content} and fua.content_id = ${content_id} and fua.content_batch = ${content_batch} ) x group by x.user_id, x.nik, x.full_name, x.created_at order by x.user_id`
    }
    // const nik = '00'
    if (nik) {
      query = `select x.user_id, x.nik, x.full_name, x.created_at, concat('[',string_agg(distinct ('{ question_id: '||x.question_id||',question_digiverse_id: '||COALESCE(x.digiverse_id, 0)||',answer: '||COALESCE(x.answer, 0)||',answer_text: "'||COALESCE(x.answer_text, '')||'"}')::varchar,','),']') user_answer from ( select fua.user_id, u.full_name, u.nik, fua.created_at, fua.created_by, fua.content_type, fua.content_id, fua.content_batch, fua.feedback_content_id as question_id, fua.digiverse_id, fua.answer, fua.answer_text from feedback_user_answer fua join users u on u.id = fua.user_id where fua.content_type = ${content} and fua.content_id = ${content_id} and fua.content_batch = ${content_batch} ) x where u.nik LIKE = '${nik}' group by x.user_id, x.nik, x.full_name, x.created_at order by x.user_id`
    }
    if (content_id) {
      query = `
        SELECT DISTINCT ON (x.full_name)
          x.user_id, 
          x.nik, 
          x.full_name, 
          (SELECT to_char(MAX(created_at::timestamp) + interval '7 hours', 'YYYY-MM-DD HH24:MI:SS') 
            FROM (
              SELECT fua.created_at 
              FROM feedback_user_answer fua 
              JOIN users u ON u.id = fua.user_id 
              WHERE fua.content_id = ${content_id}
            ) x_sub
          ) as created_at,
          json_agg(
            jsonb_build_object(
              'question_id', x.question_id,
              'question_digiverse_id', COALESCE(x.digiverse_id, 0),
              'answer', COALESCE(x.answer, 0),
              'answer_text', COALESCE(x.answer_text, '')
            )
          ) as user_answer 
        FROM 
          (
            SELECT 
              fua.user_id, 
              u.full_name, 
              u.nik, 
              fua.created_at, 
              fua.created_by, 
              fua.content_type, 
              fua.content_id, 
              fua.content_batch, 
              fua.feedback_content_id as question_id, 
              fua.digiverse_id, 
              fua.answer, 
              fua.answer_text 
            FROM 
              feedback_user_answer fua 
              JOIN users u ON u.id = fua.user_id 
            WHERE 
              fua.content_id = ${content_id}
          ) x 
        GROUP BY 
          x.full_name, 
          x.user_id, 
          x.nik
        ORDER BY 
          x.full_name, 
          x.user_id
      `
    }

    if (is_telkom_group === true) {
      query = `
        SELECT 
          x.user_id, 
          x.nik, 
          x.full_name, 
          x.created_at, 
          json_agg(
            jsonb_build_object(
              'question_id', x.question_id,
              'question_digiverse_id', COALESCE(x.digiverse_id, 0),
              'answer', COALESCE(x.answer, 0),
              'answer_text', COALESCE(x.answer_text, '')
            )
          ) as user_answer 
        FROM 
          (
            SELECT 
              fua.user_id, 
              u.full_name, 
              u.nik , 
              fua.created_at, 
              fua.created_by, 
              fua.content_type, 
              fua.content_id, 
              fua.content_batch, 
              fua.feedback_content_id as question_id, 
              fua.digiverse_id, 
              fua.answer, 
              fua.answer_text 
            FROM 
              feedback_user_answer fua 
              JOIN users u ON u.id = fua.user_id 
            WHERE 
              fua.content_id = ${content_id}
              AND u.nik IS NOT NULL
          ) x 
        GROUP BY 
          x.user_id, 
          x.nik, 
          x.full_name, 
          x.created_at 
        ORDER BY 
          x.user_id
      `
    }

    if (content_id && nik) {
      query = `
        SELECT 
          x.user_id, 
          x.nik, 
          x.full_name, 
          to_char(MAX(x.created_at::timestamp) + interval '7 hours', 'YYYY-MM-DD HH24:MI:SS') as created_at,
          json_agg(
            jsonb_build_object(
              'question_id', x.question_id,
              'question_digiverse_id', COALESCE(x.digiverse_id, 0),
              'answer', COALESCE(x.answer, 0),
              'answer_text', COALESCE(x.answer_text, '')
            )
          ) as user_answer 
        FROM 
          (
            SELECT 
              fua.user_id, 
              u.full_name, 
              u.nik , 
              fua.created_at, 
              fua.created_by, 
              fua.content_type, 
              fua.content_id, 
              fua.content_batch, 
              fua.feedback_content_id as question_id, 
              fua.digiverse_id, 
              fua.answer, 
              fua.answer_text 
            FROM 
              feedback_user_answer fua 
              JOIN users u ON u.id = fua.user_id 
            WHERE 
              fua.content_id = ${content_id}
          ) x 
        WHERE x.nik = '${nik}'
        GROUP BY 
          x.user_id, 
          x.nik, 
          x.full_name
        ORDER BY 
          x.user_id`
    }

    if (page_size && page) {
      query += ` LIMIT ${page_size} OFFSET ${(page - 1) * page_size}`
    }
    const result = await Model.knex().raw(query)
    const total_data = result.rows.length
    const total_pages = Math.ceil(total_data / page_size)
    const current_page = page

    // Clean up the user_answer field in the response if it's a string
    const response = {
      participant: result.rows.map((participant) => {
        const userAnswer =
          typeof participant.user_answer === 'string'
            ? JSON.parse(participant.user_answer.replace(/^{(.)+}|[\\"]+/g, ''))
            : participant.user_answer
        return {
          user_id: participant.user_id,
          nik: participant.nik,
          full_name: participant.full_name,
          created_at: participant.created_at,
          user_answer: userAnswer,
        }
      }),
      pagination: {
        total_data,
        total_pages,
        current_page,
      },
    }

    return Promise.resolve(response)
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  GetfindFeedbacks,
}
