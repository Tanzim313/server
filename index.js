const express = require('express')
const cors =require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://models-db:xZfw0lflu4XuteMp@cluster0.7k1gh4c.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('model-db')
    const modelCollection  = db.collection('models')

    const modelCollection2 = db.collection('booking')


    //find
    //findOne


    app.get('/models',async(req,res)=>{

        const result = await modelCollection.find().toArray(); //promise
        
        console.log(result)

        res.send(result);
    })


    app.get('/models/:id',async(req,res) =>{
          const {id} = req.params
          console.log(id)
          const objectId = new ObjectId(id)

          const result = await modelCollection.findOne({_id: objectId})

          res.send({
            success:true,
            result
          })
    })

    app.get('/models/email/:email',async(req,res)=>{
      const providerEmail = req.params.email;

      const result = await modelCollection.find({created_by: providerEmail}).toArray();

      res.send({
        success:true,
        
        result

      })
    })


    //post method
    // insertMany
    //insertOne

    app.post('/models',async(req,res)=>{

              const data = req.body
              console.log(data)

               data.price = parseFloat(data.price);

               const result = modelCollection.insertOne(data)

              res.send({
                success: true,
                result
              })



    })

//PUT
//updatedOne
//updateMany


app.put('/models/:id',async(req,res)=>{
        
  const {id} = req.params
  const data = req.body
          console.log(id)
          console.log(data)
          const objectId = new ObjectId(id)
          const filter = {_id:objectId}
          
          const update ={
            $set:data
          }

          const result = await modelCollection.
          updateOne(filter,update)


          res.send({
            success: true,
            result
          })



})


//delete
//deleteOne
//deleteMany


app.delete('/models/:id',async(req,res)=>{
  const {id} = req.params

  const objectId = new ObjectId(id)
  const filter = {_id:objectId}
          

  const result = await modelCollection.deleteOne(filter)

  res.send({
    success:true,
    result

  })
})


app.get('/filter/:min-:max',async(req,res)=>{

  const min = Number(req.params.min)
  const max = Number(req.params.max)

  const result = await modelCollection.find({
    price: {$gte:min,$lte:max}
  }).toArray();

  res.send({
    success: true,
    result
  });

});



//booking...


    app.post('/booking',async(req,res)=>{

              const data = req.body
              console.log(data)

               const result = await modelCollection2.insertOne(data)

              res.send({
                success: true,
                result
              })
    })


    app.get('/booking/:email',async(req,res)=>{
        const providerEmail = req.params.email;

        const result = await modelCollection2.find({userEmail: providerEmail}).toArray();

        for(let booking of result){
          const service = await modelCollection.findOne({
              _id:new ObjectId(booking.serviceId),
          });

          booking.serviceDetails = service;
        }

      res.send({
        success:true,
        
        result

      })
    })


//delete
//deleteOne
//deleteMany


app.delete('/booking/:id',async(req,res)=>{
  const {id} = req.params

  const objectId = new ObjectId(id)
  const filter = {_id:objectId}
          

  const result = await modelCollection2.deleteOne(filter)

  res.send({
    success:true,
    result
    
  })
})













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
