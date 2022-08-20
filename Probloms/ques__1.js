const getMultiplyStep = (a, b) => {
    a = a.toString().split("").reverse().join("")
    b = b.toString().split("").reverse().join("")
    let result = []
    let k = 0

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            k++
            let place = i + 1
            let product = (Number(a[i]) * Number(b[j])).toString()
            let cal = `( ${Number(b[j])} * ${Number(a[i])} ) = ${product}`
            let obj = {}
            obj[`step${k}`] = {}
            obj[`step${k}`].place = place
            obj[`step${k}`].desc = cal
            if (obj[`step${k - 1}`] && obj[`step${k - 1}`].product) {
                obj[`step${k}`].product = obj[`step${k - 1}`].product + product
            } else {
                obj[`step${k}`].product = product
            }
            result.push(obj)
        }
    }
    return result
}

const a = 15
const b = 10
const result = getMultiplyStep(a, b)
console.log(result)



/*

Dear Sir / Mam

I know this is not a correct Solution because here carry is missing
i try but not get 100 %


it take time SO ..........

but if we try than defnitly make your required format

thank you 
sonu verma


*/



