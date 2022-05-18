import express, { Request, Response, NextFunction } from "express";
import { resourceLimits } from "worker_threads";
const router = express.Router();
const esClient = require("../connection.ts");
const index: String = "words";

//정보글 post 때 넣을 date 값
let get_today = new Date();
let get_year = get_today.getFullYear();
let get_month = get_today.getMonth() + 1;
let get_date = get_today.getDate();
let date = get_year + "-" + get_month + "-" + get_date;

router
  .route("/")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    let { text, sort_by } = req.query;
    let flag: Boolean = false;
    if (text && !sort_by) {
      // 철자 정보 검색
      try {
        const result = await esClient.search({
          index: index,
          body: {
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query: text,
                      fields: ["right_words", "wrong_words"],
                    },
                  },
                  { match: { type: "spelling" } },
                ],
              },
            },
          },
        });
        const flag_check = await esClient.search({
          index: index,
          body: {
            query: {
              bool: {
                must: [
                  {
                    match_phrase: {
                      right_words: text,
                    },
                  },
                  { match: { type: "spelling" } },
                ],
              },
            },
          },
        });
        if (flag_check.body.hits.total.value > 0) {
          flag = true;
        }
        return res
          .status(200)
          .json({ result: result.body.hits.hits, flag: flag });
      } catch (err) {
        console.error(err);
        next(err);
      }
    } else if (sort_by && !text) {
      // 철자 정보 게시판 조회
      try {
        const result = await esClient.search({
          index: index,
          sort: [`${sort_by}:desc`],
          body: {
            _source: ["title", "hits", "scraps", "created_at"],
            size: "10",
            query: {
              match: {
                type: "spelling",
              },
            },
          },
        });
        res.status(200).json(result.body.hits.hits);
      } catch (err) {
        console.error(err);
        next(err);
      }
    } else if (!text && !sort_by) {
      // 메인 페이지 요청
      try {
        const sort_hits_result = await esClient.search({
          index: index,
          body: {
            _source: ["title", "hits", "created_at"],
            sort: { hits: "desc" },
            size: "3",
            query: {
              match: {
                type: "spelling",
              },
            },
          },
        });
        const sort_crt_result = await esClient.search({
          index: index,
          body: {
            _source: ["title", "hits", "created_at"],
            sort: { created_at: "desc" },
            size: "3",
            query: {
              match: {
                type: "spelling",
              },
            },
          },
        });
        const result: Array<JSON> = [];
        result.push(sort_hits_result.body.hits.hits);
        result.push(sort_crt_result.body.hits.hits);
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
    } else {
      res.status(400).send("error");
    }
  });

router
  .route("/:id")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await esClient.search({
        index: index,
        body: {
          query: {
            match: {
              _id: req.params.id,
            },
          },
        },
      });
      let related = await esClient.search({
        index: index,
        body: {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: result.body.hits.hits[0]._source.right_words,
                    fields: ["right_words", "wrong_words"],
                  },
                },
              ],
              must_not: [
                {
                  match: {
                    _id: result.body.hits.hits[0]._id,
                  },
                },
              ],
            },
          },
        },
      });
      if (related.body.hits.total.value == 0) {
        related = "";
      } else {
        related = related.body.hits.hits[0]._id;
      }
      let hits = result.body.hits.hits[0]._source.hits;
      hits++;
      const count_hits = await esClient.update({
        index: index,
        id: req.params.id,
        body: {
          doc: {
            hits: hits,
            related: related,
          },
        },
      });
      res.status(200).json(result.body.hits.hits[0]._source);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;

/**
 * @swagger
 * paths:
 *  /api/spellings:
 *      get:
 *          tags: [spelling]
 *          summary: 철자 정보 조회 및 검색
 *          description: 철자 정보 조회 및 검색
 *          parameters:
 *          - in: query
 *            name: "text"
 *            required: false
 *            schema:
 *                type: string
 *                description: text
 *          - in: query
 *            name: "sort_by"
 *            required: false
 *            schema:
 *                type: string
 *                description: sort
 *          produces:
 *          - application/json
 *          responses:
 *              200:
 *                  description: 철자 정보 조회 성공
 *  /api/spellings/{id}:
 *      get:
 *          tags: [spelling]
 *          summary: 철자 정보 세부 조회
 *          description: 철자 정보 세부 조회
 *          parameters:
 *          - in: path
 *            name: "id"
 *            required: true
 *            schema:
 *                type: string
 *          produces:
 *          - application/json
 *          responses:
 *              200:
 *                  description: 철자 정보 세부 조회 성공
 */
