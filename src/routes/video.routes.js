import { Router } from "express";
import { query } from "../db.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { sendMail } from "../utils/mailer.js";
import { VideoSchema, CommentSchema } from "../validators/schema.js";

const Videoroutes = Router();
function isValidId(id) {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

//------------get/api/videos----------//
Videoroutes.get("/", async (req, res, next) => {
  try {
    const result = await query(
      "SELECT id ,user_id,title,video_url,views,created_at FROM videos ORDER BY  id ASC",
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
//-------------post/api/videos///
Videoroutes.post("/", auth, validate(VideoSchema), async (req, res, next) => {
  try {
    const { title, description, videoUrl } = req.body;

    const result = await query(
      `INSERT INTO videos (user_id, title, description, video_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, title, description ?? "", videoUrl]
    );

    return res.status(201).json({
      success: true,
      message: "Video qo'shildi",
      video: result.rows[0]
    });

  } catch (err) {
    console.error("POST VIDEO ERROR:", err);
    next(err);
  }
});

//-----------get/api/video/id------------//
Videoroutes.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      return res.status(404).json({
        message: "Video topilmadi",
      });
    }

    const result = await query(
      "UPDATE videos SET views = views + 1 WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Video topilmadi",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

//-------------------get/api/videos:id:comments//
Videoroutes.get("/:id/comments", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(404).json({ message: "Video topilmadi" });
    }

    const video = await query("SELECT id FROM videos WHERE id = $1", [id]);
    if (video.rows.length === 0) {
      return res.status(404).json({ message: "Video topilmadi" });
    }

    const result = await query(
      "SELECT id, user_id, text, created_at FROM comments WHERE video_id = $1 ORDER BY id DESC",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

//-------post/api/videos:id:comment-------------//
Videoroutes.post("/:id/comments", auth,
 validate(CommentSchema),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      if (!isValidId(id)) {
        return res.status(404).json({
          message: "Video topilmadi",
        });
      }

      const found = await query(
        `SELECT v.title, v.user_id, u.email
         FROM videos v
         JOIN users u ON u.id = v.user_id
         WHERE v.id = $1`,
        [id],
      );

      const video = found.rows[0];

      if (!video) {
        return res.status(404).json({
          message: "Video topilmadi",
        });
      }

      const result = await query(
        `INSERT INTO comments (video_id, user_id, text)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id, req.user.id, req.body.text],
      );

      const comment = result.rows[0];

      if (video.user_id !== req.user.id) {
        void sendMail(
          video.email,
          "Videongizga yangi izoh",
          `<p>Video: ${video.title}</p>
           <p>${req.user.name} yozdi: ${comment.text}</p>`,
        ).catch((err) => console.error("Email xatosi:", err));
      }

      return res.status(201).json({
        message: "Izoh qo'shildi",
        comment,
      });
    } catch (err) {
      console.error("COMMENT ERROR:", err);
      next(err);
    }
  },
);

export default Videoroutes;
