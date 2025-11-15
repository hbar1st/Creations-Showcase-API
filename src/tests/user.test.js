import { app } from "../common/serverSetup";
import { expect, test, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { deleteUsers } from "./dbutil.js"

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


test("invalid POST /sign-up", async () => {
  const res = await request(app)
    .post("/user/sign-up")

    .set("Accept", "application/json")

  
  expect(res.status).toEqual(400);
  expect(res.body.message).toEqual("Action has failed due to some validation errors");
  expect(res.body.details).toMatchObject([
      {
        type: "field",
        value: "",
        msg: "A first name is requried.",
        path: "firstname",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "Length of the first name should be between 1 and 25 characters.",
        path: "firstname",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "A last name is required.",
        path: "lastname",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "Length of the last name should be between 1 and 50 characters.",
        path: "lastname",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "A nickname is required for display purposes.",
        path: "nickname",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "Nicknames need to be between 1 and 25 characters long.",
        path: "nickname",
        location: "body",
      },
      {
        type: "field",
        value: "*****",
        msg: "A password is required.",
        path: "password",
        location: "body",
      },
      {
        type: "field",
        value: "*****",
        msg: "A minimum length of 8 characters is needed for the password. Ideally, aim to use 15 characters at least.",
        path: "password",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "An email is required.",
        path: "email",
        location: "body",
      },
      {
        type: "field",
        value: "",
        msg: "Provide a valid email address.",
        path: "email",
        location: "body",
      },
    ],
  );

  //console.log("response: ", res.status, res.body);
});

beforeEach(() => {
  initializeTestDatabase();
});

afterEach(() => {
  clearTestDatabase();
});

function initializeTestDatabase() {

}

function clearTestDatabase() {

  deleteUsers()

}

test("POST /sign-up", async () => {
  const res = await request(app)
    .post("/user/sign-up")

    .set("Accept", "application/json")
    .send({
      firstname: 'test', lastname: 'user', nickname: 'tester', email: 'tester@gmail.com', 
      password: 'testpass',
      'confirm-password': 'testpass'
    })
  
  expect(res.status).toEqual(201);

  printLogs(res)
})
/**
 * {
    "status": "success",
    "message": "Sign up successful."
}
 */

const printLogs = (res, expectedStatus = 200) => {
  if (res.status === expectedStatus) {
    return res
  };
  const error = res.error;
  console.log("error is: ", error)
  const reqData = JSON.parse(JSON.stringify(res)).req;
  console.log(` 
  request-method  : ${JSON.stringify(reqData.method)} 
  request-url     : ${JSON.stringify(reqData.url)}
  request-data    : ${JSON.stringify(reqData.data)}
  request-body    : ${JSON.stringify(reqData.body)}
  request-headers : ${JSON.stringify(reqData.headers)}
  reponse-status  : ${JSON.stringify(res.status)}
  reponse-body    : ${JSON.stringify(res.body)}
  `
  );
}

/**
 *   
 * expect(res.status).toEqual(200);
  expect(res.body.status).toEqual("success");
  expect(res.body.message).toEqual(
    "Sign up successful."
  );
 */