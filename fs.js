const fs = require('fs');

// fs.readFile('./sample.txt', 'utf-8', function(err, data){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(data);
//     }
// })


try {
    let data = fs.readFileSync('./sample1.txt', 'utf-8');
    console.log(data);
}catch(err){
    console.log('出错了');
}