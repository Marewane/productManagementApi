const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// logging middleware
app.use((req,res,next)=>{
    console.log('this is the first middleware');
    // next(new Error("This is the error marwane"));
    throw new Error('marwane error occured')
});

app.use((req,res,next)=>{
    console.log('this is the second middleware');
});

app.use((err,req,res,next)=>{
    console.log('this is the error handling middleware ',err.message);
    next();
});

app.get('/',(req,res)=>{
    console.log('main callback');
    res.send('main callback');
})

app.listen(5000,()=>{
    console.log('has connect to the server');
})