import { app } from "./common/serverSetup";
import { expect, test } from "vitest";
import request from "supertest";

test("negative test: user route with no token",
  async (done) => {
  const res = await request(app)
    .get("/user")

    .set("Accept", "text/html; charset=utf-8")
    .expect("Content-Type", /json/)

    .expect(200);

  console.log("response: ",res.status)

});