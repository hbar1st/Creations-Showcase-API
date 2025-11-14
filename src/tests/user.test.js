import { app } from "./common/serverSetup";
import { expect, test } from "vitest";
import request from "supertest";

test("negative test: user route with no token",
  async (done) => {
  const res = await request(app)
    .get("/user")

    .set("Accept", "text/html; charset=utf-8")
    .expect(401);

  console.log("response: ",res.text)

  });

  test.skip("wacko test",  (done) => {
    const res =  request(app)
      .get("/user")

      .set("Accept", "text/html; charset=utf-8")
      .expect("Content-Type", /text/)
      .expect(200, done);

    console.log("response: ", res.text);
  });