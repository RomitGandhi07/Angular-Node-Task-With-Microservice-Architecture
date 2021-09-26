const elasticsearch=require('elasticsearch');


const bonsai_url = "https://7sn74jzlfs:re8aq0bgku@mini-project-96016372.us-east-1.bonsaisearch.net:443";

const client = new elasticsearch.Client({
    host: bonsai_url
})

const checkDBConnection=()=>{
    client.ping({
        requestTimeout: 30000
    }, (error) => {
        if (error) {
            console.log("Elastic Server is Down...");
            process.exit(1);
        }
        else {
            console.log("Connected to Elastic search...");
        }
    });
}

module.exports={
    client,
    checkDBConnection
};
