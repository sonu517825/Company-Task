function preferredOrder(obj, order) {
  let newObject = {};
  for (let i = 0; i < order.length; i++) {
    if (obj.hasOwnProperty(order[i])) {
      newObject[order[i]] = obj[order[i]];
    }
  }
  return newObject;
}

function getSum(result, step) {
  let first = "0" + result[1]["step2"]["product"];
  first = first.split("").reverse().join("");
  let last = result[4]["step5"]["product"].split("").reverse().join("");
  for (let i = 1; i < 4; i++) {
    let obj = {};
    obj[`step${step + i}`] = {};
    let carry = 0;
    if (i === 1) {
      carry = 0;
    } else {
      carry = Math.floor((Number(last[i - 1]) + Number(first[i - 1])) / 10);
    }
    obj[`step${step + i}`].carry = carry.toString();
    let sum = Number(last[i - 1]) + Number(first[i - 1]);
    obj[`step${step + i}`].sum = sum.toString();
    let cal = `${Number(first[i - 1])} + ${Number(
      last[i - 1]
    )} + ${carry} = ${sum}`;
    obj[`step${step + i}`].desc = cal.toString();
    if (i > 1) {
      obj[`step${step + i}`].sum =
        sum + result[step + i - 2][`step${step + i - 1}`].sum;
    } else {
      obj[`step${step + i}`].sum = sum.toString();
    }
    let res = preferredOrder(obj[`step${step + i}`], ["carry", "sum", "desc"]);
    obj[`step${step + i}`] = res;
    result.push(obj);
  }

  return result;
}

const getMultiplyStep = (a, b) => {
  a = a.toString().split("").reverse().join("");
  b = b.toString().split("").reverse().join("");
  let result = [];
  let k = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      k++;
      let obj = {};
      let place = i + 1;
      let product = (Number(a[i]) * Number(b[j])).toString();
      let carry = 0;
      if (j === 0) {
        carry = 0;
      } else {
        carry = Math.floor((Number(a[i]) * Number(b[j])) / 10);
      }
      let cal = `( ${Number(b[j])} * ${Number(a[i])} ) + ${carry} = ${product}`;
      if (place === 2 && j === 0) {
        k++;
        let t = {
          step3: {
            place: 2,
            carry: "0",
            product: "0",
            desc: "Adding Prepend Zeros",
          },
        };
        result.push(t);
      }
      obj[`step${k}`] = {};
      obj[`step${k}`].place = place;
      obj[`step${k}`].carry = carry.toString();
      obj[`step${k}`].desc = cal;
      if ((k > 1 && j > 0) || (place === 2 && j === 0)) {
        obj[`step${k}`].product =
          product + result[k - 2][`step${k - 1}`].product;
      } else {
        obj[`step${k}`].product = product;
      }
      let res = preferredOrder(obj[`step${k}`], [
        "place",
        "carry",
        "product",
        "desc",
      ]);
      obj[`step${k}`] = res;
      result.push(obj);
    }
  }
  return getSum(result, k);
};

const a = 90; // 15 , 12
const b = 11; //11 , 10 ;
const result = getMultiplyStep(a, b);
console.log("Total Steps " , result)
console.log("Multiply = " , Number(result[result.length-1]["step8"]["sum"]));

/*

Dear Sir / Mam

Dear Aman i Try lot and get result but it is work if no carry 


it take time SO ..........

but if we try than defnitly make your required format

thank you 
sonu verma


*/
