/*

function middleware(req, res, next) {
let { reqId, ...body } = req.body;
// Created promise from request body
let descriptionPromise = JsonReader(body); // Asynchronous call returns a
promise
// Sequential Step
// 1. Create description from Body(JSON)
// 2. Execute mathOperation function
descriptionPromise.then((descriptionString)=>{
req.body.description = descriptionString;
return runMathOperation(descriptionString); // Asynchronous call
returns a promise
}).then((stdout, stderr)=>{
req.body.stdout = stdout.stdout;
next()
}).catch((err)=>{
let parseErr = {};
parseErr['reqId'] = reqId;
if (err.stdout[0] === '*'){
err = err.stdout.slice(22);
parseErr['errorMsg'] = err;
res.status(450); //Math Error
res.statusMessage = "MathError";
}else{
res.statusMessage = "ServerError";
parseErr['errorMsg'] = err;
res.status(500);
}
res.send(parseErr);
});
}

*/

const middleware = async function (req, res, next) {
  try {
    const JsonReader = async (body) => {
      // reader logic here
      // return promise
      return "descriptionString";
    };

    const runMathOperation = async (descriptionString) => {
      // Math Operation logic here
      // return promise
      return "descriptionString";
    };

    let { reqId, ...body } = req.body;

    let descriptionPromise = await JsonReader(body);

    if (descriptionPromise) {
      req.body.description = descriptionPromise;
      await runMathOperation(descriptionString);
    }
  } catch (error) {
    if (error.stdout[0] === "*") {
      let parseErr = {};
      err = err.stdout.slice(22);
      parseErr["errorMsg"] = error.message;
      res.statusMessage = "MathError";
      return res.status(450).send({
        status: false,
        error: parseErr,
      });
    }
    return res.status(500).send({
      status: false,
      message: error.message,
      error: "Server Error",
    });
  }
};

/*

Dear Sir / Mam

This is a sample code format. We can also make better this code 
like if we want to excess only json data from body 
no need to use json reader we can use global middlewear 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

But if in json reader we perform file read write operation than this is fine

for every async function we should use try catch for error handling

if we use try catch no need to handle std error

And So on 

*/
