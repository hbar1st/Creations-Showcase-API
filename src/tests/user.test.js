import { app } from "../common/serverSetup";
import { expect, test } from "vitest";
import request from "supertest";

test("negative test: user route with no token", async () => {
  const res = await request(app)
    .get("/user")

    .set("Accept", "text/html; charset=utf-8");

  expect(res.text).toEqual("Unauthorized");
  expect(res.status).toEqual(401);

  //console.log("response: ", res.text, res.body);
});

//this is similar test as above but without async/await and using .end to trigger a callback at the end
test("wacko test", () => {
  const res = request(app)
    .get("/user")

    .set("Accept", "text/html; charset=utf-8")

    .expect(401)

    .end(function (err, res) {
      if (err) throw err;
    });

  //console.log("response: ", res.text);
});

test("negative test: user route with invalid token", async () => {
  const res = await request(app)
    .get("/user")

    .set("Accept", "text/html; charset=utf-8")
    .set("Authorization","Bearer false");

  expect(res.text).toEqual("Unauthorized");
  expect(res.status).toEqual(401);

  //console.log("response: ", res.text, res.body);
});

test("test 404 bad route handling", async () => {
  const res = await request(app)
    .get("/sign-up")

    .set("Accept", "application/json");

  expect(res.status).toEqual(404);
  expect(res.body.status).toEqual("fail");
  expect(res.body.message).toEqual(
    "This is a surprising request. I can't find /sign-up on this server!"
  );

  //console.log("response: ", res.status, res.body.status, res.body.message);
});

// TODO: why is this bad test passing?
test("POST /sign-up", async () => {
  const res = await request(app)
    .post("/user/sign-up")

    .set("Accept", "application/json")
    .expect(function (res) {
      res.body.firstname = "test";
      res.body.lastname = "user";
    });

  expect(res.status).toEqual(400);
  expect(res.body.status).toEqual("fail");
  expect(res.body.message).toEqual(
    "This is a surprising request. I can't find /sign-up on this server!"
  );

  console.log("response: ", res.status, res.body.status, res.body.message);
});