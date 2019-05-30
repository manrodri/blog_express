var bodyParser     = require('body-parser'),
methodOverride     = require("method-override"),
mongoose           = require("mongoose"),
express            = require("express"),
app                = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view_engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image:  String,
    body:   String,
    created: { type: Date, default: Date.now} 
});
var Blog = mongoose.model("Blog", blogSchema);


// ROUTES
// INDEX ROUTE
app.get('/', function(req, res) {
    res.redirect('/blogs');
});
app.get('/blogs', function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log('ERROR!!');
       } else{
           res.render('index.ejs', {blogs: blogs});
       };
   });
   
});
// NEW ROUTE
app.get("/blogs/new", function(req, res) {
   res.render('new.ejs'); 
});
// CREATE ROUTE
app.post('/blogs', function(req,res){
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render('new.ejs');
       } // redirect to index
       else {
           res.redirect('/blogs');
       };
   });
   
});

// show route
app.get('/blogs/:id', function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect('/blogs');
       }
       else{
           res.render('show.ejs', {blog:foundBlog});
       };
   });
   
});
// edit route
app.get('/blogs/:id/edit', function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
        res.redirect('/blogs'); 
      } else{
          res.render('edit.ejs', {blog: foundBlog}); 
      };
   });
});
// update route
app.put('/blogs/:id', function(req,res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect('/blogs');
       } else{
         res.redirect("/blogs/" + req.params.id); 
       };
   });
   res.send('update route!'); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is RUNNING!!");
});
