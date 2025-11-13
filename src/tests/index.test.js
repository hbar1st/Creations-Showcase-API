import { app } from "./common/serverSetup"
import { expect, test } from "vitest";
import request from "supertest";

test("index route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({
      message:
        "The Creations Showcase API is an API that lets you showcase your web development projects and receive feedback on them.",
    })
    .expect(200, done);
});

test("testing route works", (done) => {
  request(app)
    .post("/test")
    .type("form")
    .send({ item: "hey" })
    .then(() => {
      request(app)
        .get("/test")
        .expect({ array: ["hey"] }, done);
    });
});
