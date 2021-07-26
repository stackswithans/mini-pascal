type Err = {};
type Ok<T> = { result: T };
type Result<T> = Ok<T> | Err;

function isOk<T>(result: Result<T>): result is Err {
    return result.hasOwnProperty("result");
}

export { Err, Ok, Result, isOk };
