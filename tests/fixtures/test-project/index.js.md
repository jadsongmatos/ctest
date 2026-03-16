# External tests for index.js

**Arquivo:** `index.js`

## Checklist

- [ ] express
- [ ] path
- [ ] fs

## express

**Consultas usadas no Horsebox:** `express`, `express express`

**Arquivos de teste encontrados:** 119

### ../../../../../.ctest/repos/f3c62de455-express/test/express.static.js

#### should require root path

```ts
it('should require root path', function () {
      assert.throws(express.static.bind(), /root path required/)
    }
```

#### should require root path to be string

```ts
it('should require root path to be string', function () {
      assert.throws(express.static.bind(null, 42), /root path.*string/)
    }
```

#### should fall-through when URL too long

```ts
it('should fall-through when URL too long', function (done) {
        var app = express()
        var root = fixtures + Array(10000).join('/foobar')

        app.use(express.static(root, { 'fallthrough': true }))
        app.use(function (req, res, next) {
          res.sendStatus(404)
        })

        request(app)
          .get('/')
          .expect(404, 'Not Found', done)
      }
```

#### should 404 when URL too long

```ts
it('should 404 when URL too long', function (done) {
        var app = express()
        var root = fixtures + Array(10000).join('/foobar')

        app.use(express.static(root, { 'fallthrough': false }))
        app.use(function (req, res, next) {
          res.sendStatus(404)
        })

        request(app)
          .get('/')
          .expect(404, /ENAMETOOLONG/, done)
      }
```

#### should reject non-functions

```ts
it('should reject non-functions', function () {
      assert.throws(express.static.bind(null, fixtures, { 'setHeaders': 3 }), /setHeaders.*function/)
    }
```

#### should not alter the status

```ts
it('should not alter the status', function (done) {
      var app = express()

      app.use(function (req, res, next) {
        res.status(501)
        next()
      })
      app.use(express.static(fixtures))

      request(app)
        .get('/todo.txt')
        .expect(501, '- groceries', done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/exports.js

#### should expose Router

```ts
it('should expose Router', function(){
    assert.strictEqual(typeof express.Router, 'function')
  }
```

#### should expose json middleware

```ts
it('should expose json middleware', function () {
    assert.equal(typeof express.json, 'function')
    assert.equal(express.json.length, 1)
  }
```

#### should expose raw middleware

```ts
it('should expose raw middleware', function () {
    assert.equal(typeof express.raw, 'function')
    assert.equal(express.raw.length, 1)
  }
```

#### should expose static middleware

```ts
it('should expose static middleware', function () {
    assert.equal(typeof express.static, 'function')
    assert.equal(express.static.length, 2)
  }
```

#### should expose text middleware

```ts
it('should expose text middleware', function () {
    assert.equal(typeof express.text, 'function')
    assert.equal(express.text.length, 1)
  }
```

#### should expose urlencoded middleware

```ts
it('should expose urlencoded middleware', function () {
    assert.equal(typeof express.urlencoded, 'function')
    assert.equal(express.urlencoded.length, 1)
  }
```

#### should expose the application prototype

```ts
it('should expose the application prototype', function(){
    assert.strictEqual(typeof express.application, 'object')
    assert.strictEqual(typeof express.application.set, 'function')
  }
```

#### should expose the request prototype

```ts
it('should expose the request prototype', function(){
    assert.strictEqual(typeof express.request, 'object')
    assert.strictEqual(typeof express.request.accepts, 'function')
  }
```

#### should expose the response prototype

```ts
it('should expose the response prototype', function(){
    assert.strictEqual(typeof express.response, 'object')
    assert.strictEqual(typeof express.response.send, 'function')
  }
```

#### should permit modifying the .application prototype

```ts
it('should permit modifying the .application prototype', function(){
    express.application.foo = function(){ return 'bar'; };
    assert.strictEqual(express().foo(), 'bar')
  }
```

#### should permit modifying the .request prototype

```ts
it('should permit modifying the .request prototype', function(done){
    express.request.foo = function(){ return 'bar'; };
    var app = express();

    app.use(function(req, res, next){
      res.end(req.foo());
    });

    request(app)
    .get('/')
    .expect('bar', done);
  }
```

#### should permit modifying the .response prototype

```ts
it('should permit modifying the .response prototype', function(done){
    express.response.foo = function(){ this.send('bar'); };
    var app = express();

    app.use(function(req, res, next){
      res.foo();
    });

    request(app)
    .get('/')
    .expect('bar', done);
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/config.js

#### should set a value

```ts
it('should set a value', function () {
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    }
```

#### should set prototype values

```ts
it('should set prototype values', function () {
      var app = express()
      app.set('hasOwnProperty', 42)
      assert.strictEqual(app.get('hasOwnProperty'), 42)
    }
```

#### should return the app

```ts
it('should return the app', function () {
      var app = express();
      assert.equal(app.set('foo', 'bar'), app);
    }
```

#### should return the app when undefined

```ts
it('should return the app when undefined', function () {
      var app = express();
      assert.equal(app.set('foo', undefined), app);
    }
```

#### should return set value

```ts
it('should return set value', function () {
      var app = express()
      app.set('foo', 'bar')
      assert.strictEqual(app.set('foo'), 'bar')
    }
```

#### should return undefined for prototype values

```ts
it('should return undefined for prototype values', function () {
      var app = express()
      assert.strictEqual(app.set('hasOwnProperty'), undefined)
    }
```

#### should throw on bad value

```ts
it('should throw on bad value', function(){
        var app = express();
        assert.throws(app.set.bind(app, 'etag', 42), /unknown value/);
      }
```

#### should set "etag fn"

```ts
it('should set "etag fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('etag', fn)
        assert.equal(app.get('etag fn'), fn)
      }
```

#### should set "trust proxy fn"

```ts
it('should set "trust proxy fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('trust proxy', fn)
        assert.equal(app.get('trust proxy fn'), fn)
      }
```

#### should return undefined when unset

```ts
it('should return undefined when unset', function(){
      var app = express();
      assert.strictEqual(app.get('foo'), undefined);
    }
```

#### should otherwise return the value

```ts
it('should otherwise return the value', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    }
```

#### should default to the parent app

```ts
it('should default to the parent app', function(){
        var app = express();
        var blog = express();

        app.set('title', 'Express');
        app.use(blog);
        assert.equal(blog.get('title'), 'Express');
      }
```

#### should given precedence to the child

```ts
it('should given precedence to the child', function(){
        var app = express();
        var blog = express();

        app.use(blog);
        app.set('title', 'Express');
        blog.set('title', 'Some Blog');

        assert.equal(blog.get('title'), 'Some Blog');
      }
```

#### should inherit "trust proxy" setting

```ts
it('should inherit "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn() { return false }

        app.set('trust proxy', fn);
        assert.equal(app.get('trust proxy'), fn);
        assert.equal(app.get('trust proxy fn'), fn);

        app.use(blog);

        assert.equal(blog.get('trust proxy'), fn);
        assert.equal(blog.get('trust proxy fn'), fn);
      }
```

#### should prefer child "trust proxy" setting

```ts
it('should prefer child "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn1() { return false }
        function fn2() { return true }

        app.set('trust proxy', fn1);
        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);

        blog.set('trust proxy', fn2);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);

        app.use(blog);

        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);
      }
```

#### should set the value to true

```ts
it('should set the value to true', function(){
      var app = express();
      assert.equal(app.enable('tobi'), app);
      assert.strictEqual(app.get('tobi'), true);
    }
```

#### should set prototype values

```ts
it('should set prototype values', function () {
      var app = express()
      app.enable('hasOwnProperty')
      assert.strictEqual(app.get('hasOwnProperty'), true)
    }
```

#### should set the value to false

```ts
it('should set the value to false', function(){
      var app = express();
      assert.equal(app.disable('tobi'), app);
      assert.strictEqual(app.get('tobi'), false);
    }
```

#### should set prototype values

```ts
it('should set prototype values', function () {
      var app = express()
      app.disable('hasOwnProperty')
      assert.strictEqual(app.get('hasOwnProperty'), false)
    }
```

#### should default to false

```ts
it('should default to false', function(){
      var app = express();
      assert.strictEqual(app.enabled('foo'), false);
    }
```

#### should return true when set

```ts
it('should return true when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.enabled('foo'), true);
    }
```

#### should default to false for prototype values

```ts
it('should default to false for prototype values', function () {
      var app = express()
      assert.strictEqual(app.enabled('hasOwnProperty'), false)
    }
```

#### should default to true

```ts
it('should default to true', function(){
      var app = express();
      assert.strictEqual(app.disabled('foo'), true);
    }
```

#### should return false when set

```ts
it('should return false when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.disabled('foo'), false);
    }
```

#### should default to true for prototype values

```ts
it('should default to true for prototype values', function () {
      var app = express()
      assert.strictEqual(app.disabled('hasOwnProperty'), true)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.js

#### should inherit from event emitter

```ts
it('should inherit from event emitter', function(done){
    var app = express();
    app.on('foo', done);
    app.emit('foo');
  }
```

#### should be callable

```ts
it('should be callable', function(){
    var app = express();
    assert.equal(typeof app, 'function');
  }
```

#### should 404 without routes

```ts
it('should 404 without routes', function(done){
    request(express())
    .get('/')
    .expect(404, done);
  }
```

#### should return the parent when mounted

```ts
it('should return the parent when mounted', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    assert(!app.parent, 'app.parent');
    assert.strictEqual(blog.parent, app)
    assert.strictEqual(blogAdmin.parent, blog)
  }
```

#### should return the mounted path

```ts
it('should return the mounted path', function(){
    var admin = express();
    var app = express();
    var blog = express();
    var fallback = express();

    app.use('/blog', blog);
    app.use(fallback);
    blog.use('/admin', admin);

    assert.strictEqual(admin.mountpath, '/admin')
    assert.strictEqual(app.mountpath, '/')
    assert.strictEqual(blog.mountpath, '/blog')
    assert.strictEqual(fallback.mountpath, '/')
  }
```

#### should return the canonical

```ts
it('should return the canonical', function(){
    var app = express()
      , blog = express()
      , blogAdmin = express();

    app.use('/blog', blog);
    blog.use('/admin', blogAdmin);

    assert.strictEqual(app.path(), '')
    assert.strictEqual(blog.path(), '/blog')
    assert.strictEqual(blogAdmin.path(), '/blog/admin')
  }
```

#### should disable "view cache"

```ts
it('should disable "view cache"', function(){
    var app = express();
    assert.ok(!app.enabled('view cache'))
  }
```

#### should enable "view cache"

```ts
it('should enable "view cache"', function(){
    var app = express();
    assert.ok(app.enabled('view cache'))
  }
```

#### should default to development

```ts
it('should default to development', function(){
    var app = express();
    assert.strictEqual(app.get('env'), 'development')
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.baseUrl.js

#### should be empty for top-level route

```ts
it('should be empty for top-level route', function(done){
      var app = express()

      app.get('/:a', function(req, res){
        res.end(req.baseUrl)
      })

      request(app)
      .get('/foo')
      .expect(200, '', done)
    }
```

#### should contain lower path

```ts
it('should contain lower path', function(done){
      var app = express()
      var sub = express.Router()

      sub.get('/:b', function(req, res){
        res.end(req.baseUrl)
      })
      app.use('/:a', sub)

      request(app)
      .get('/foo/bar')
      .expect(200, '/foo', done);
    }
```

#### should contain full lower path

```ts
it('should contain full lower path', function(done){
      var app = express()
      var sub1 = express.Router()
      var sub2 = express.Router()
      var sub3 = express.Router()

      sub3.get('/:d', function(req, res){
        res.end(req.baseUrl)
      })
      sub2.use('/:c', sub3)
      sub1.use('/:b', sub2)
      app.use('/:a', sub1)

      request(app)
      .get('/foo/bar/baz/zed')
      .expect(200, '/foo/bar/baz', done);
    }
```

#### should travel through routers correctly

```ts
it('should travel through routers correctly', function(done){
      var urls = []
      var app = express()
      var sub1 = express.Router()
      var sub2 = express.Router()
      var sub3 = express.Router()

      sub3.get('/:d', function(req, res, next){
        urls.push('0@' + req.baseUrl)
        next()
      })
      sub2.use('/:c', sub3)
      sub1.use('/', function(req, res, next){
        urls.push('1@' + req.baseUrl)
        next()
      })
      sub1.use('/bar', sub2)
      sub1.use('/bar', function(req, res, next){
        urls.push('2@' + req.baseUrl)
        next()
      })
      app.use(function(req, res, next){
        urls.push('3@' + req.baseUrl)
        next()
      })
      app.use('/:a', sub1)
      app.use(function(req, res, next){
        urls.push('4@' + req.baseUrl)
        res.end(urls.join(','))
      })

      request(app)
      .get('/foo/bar/baz/zed')
      .expect(200, '3@,1@/foo,0@/foo/bar/baz,2@/foo/bar,4@', done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/utils.js

#### should support strings

```ts
it('should support strings', function(){
    assert.strictEqual(utils.etag('express!'),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  }
```

#### should support utf8 strings

```ts
it('should support utf8 strings', function(){
    assert.strictEqual(utils.etag('express❤', 'utf8'),
      '"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  }
```

#### should support buffer

```ts
it('should support buffer', function(){
    assert.strictEqual(utils.etag(Buffer.from('express!')),
      '"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  }
```

#### should support strings

```ts
it('should support strings', function(){
    assert.strictEqual(utils.wetag('express!'),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  }
```

#### should support utf8 strings

```ts
it('should support utf8 strings', function(){
    assert.strictEqual(utils.wetag('express❤', 'utf8'),
      'W/"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  }
```

#### should support buffer

```ts
it('should support buffer', function(){
    assert.strictEqual(utils.wetag(Buffer.from('express!')),
      'W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  }
```

#### should return generateETag for true

```ts
it('should return generateETag for true', function () {
    const fn = utils.compileETag(true);
    assert.strictEqual(fn('express!'), utils.wetag('express!'));
  }
```

#### should return generateETag for string values "strong" and "weak"

```ts
it('should return generateETag for string values "strong" and "weak"', function () {
    assert.strictEqual(utils.compileETag('strong')("express"), utils.etag("express"));
    assert.strictEqual(utils.compileETag('weak')("express"), utils.wetag("express"));
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.status.js

#### should set the status code when valid

```ts
it('should set the status code when valid', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.status(200).end();
      });

      request(app)
        .get('/')
        .expect(200, done);
    }
```

#### should set the response status code to 101

```ts
it('should set the response status code to 101', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(101).end()
        })

        request(app)
          .get('/')
          .expect(101, done)
      }
```

#### should set the response status code to 201

```ts
it('should set the response status code to 201', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(201).end()
        })

        request(app)
          .get('/')
          .expect(201, done)
      }
```

#### should set the response status code to 302

```ts
it('should set the response status code to 302', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(302).end()
        })

        request(app)
          .get('/')
          .expect(302, done)
      }
```

#### should set the response status code to 403

```ts
it('should set the response status code to 403', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(403).end()
        })

        request(app)
          .get('/')
          .expect(403, done)
      }
```

#### should set the response status code to 501

```ts
it('should set the response status code to 501', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(501).end()
        })

        request(app)
          .get('/')
          .expect(501, done)
      }
```

#### should set the response status code to 700

```ts
it('should set the response status code to 700', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(700).end()
        })

        request(app)
          .get('/')
          .expect(700, done)
      }
```

#### should set the response status code to 800

```ts
it('should set the response status code to 800', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(800).end()
        })

        request(app)
          .get('/')
          .expect(800, done)
      }
```

#### should set the response status code to 900

```ts
it('should set the response status code to 900', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.status(900).end()
        })

        request(app)
          .get('/')
          .expect(900, done)
      }
```

#### should raise error for status code below 100

```ts
it('should raise error for status code below 100', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(99).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for status code above 999

```ts
it('should raise error for status code above 999', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(1000).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for non-integer status codes

```ts
it('should raise error for non-integer status codes', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(200.1).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for undefined status code

```ts
it('should raise error for undefined status code', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(undefined).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for null status code

```ts
it('should raise error for null status code', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(null).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for string status code

```ts
it('should raise error for string status code', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status("200").end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

#### should raise error for NaN status code

```ts
it('should raise error for NaN status code', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.status(NaN).end();
        });

        request(app)
          .get('/')
          .expect(500, /Invalid status code/, done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.locals.js

#### should default object with null prototype

```ts
it('should default object with null prototype', function () {
      var app = express()
      assert.ok(app.locals)
      assert.strictEqual(typeof app.locals, 'object')
      assert.strictEqual(Object.getPrototypeOf(app.locals), null)
    }
```

#### should contain app settings

```ts
it('should contain app settings ', function () {
        var app = express()
        app.set('title', 'Express')
        assert.ok(app.locals.settings)
        assert.strictEqual(typeof app.locals.settings, 'object')
        assert.strictEqual(app.locals.settings, app.settings)
        assert.strictEqual(app.locals.settings.title, 'Express')
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.router.js

#### should restore req.params after leaving router

```ts
it('should restore req.params after leaving router', function (done) {
    var app = express();
    var router = new express.Router();

    function handler1(req, res, next) {
      res.setHeader('x-user-id', String(req.params.id));
      next()
    }

    function handler2(req, res) {
      res.send(req.params.id);
    }

    router.use(function (req, res, next) {
      res.setHeader('x-router', String(req.params.id));
      next();
    });

    app.get('/user/:id', handler1, router, handler2);

    request(app)
      .get('/user/1')
      .expect('x-router', 'undefined')
      .expect('x-user-id', '1')
      .expect(200, '1', done);
  }
```

#### should include ' + method.toUpperCase(), function (done) {
        if (method === 'query' && shouldSkipQuery(process.versions.node)) {
          this.skip()
        }
        var app = express();

        app[method]('/foo

```ts
it('should include ' + method.toUpperCase(), function (done) {
        if (method === 'query' && shouldSkipQuery(process.versions.node)) {
          this.skip()
        }
        var app = express();

        app[method]('/foo', function (req, res) {
          res.send(method)
        }
```

#### should reject numbers for app.' + method, function () {
        var app = express();
        assert.throws(app[method].bind(app, '/

```ts
it('should reject numbers for app.' + method, function () {
        var app = express();
        assert.throws(app[method].bind(app, '/', 3), /argument handler must be a function/);
      })
    });

    it('should re-route when method is altered', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(function (req, res, next) {
        if (req.method !== 'POST') return next();
        req.method = 'DELETE';
        res.setHeader('X-Method-Altered', '1');
        next();
      });

      app.delete('/', function (req, res) {
        res.end('deleted everything');
      });

      request(app)
        .get('/')
        .expect(404, cb)

      request(app)
        .delete('/')
        .expect(200, 'deleted everything', cb);

      request(app)
        .post('/')
        .expect('X-Method-Altered', '1')
        .expect(200, 'deleted everything', cb);
    }
```

#### should decode correct params

```ts
it('should decode correct params', function (done) {
      var app = express();

      app.get('/:name', function (req, res) {
        res.send(req.params.name);
      });

      request(app)
        .get('/foo%2Fbar')
        .expect('foo/bar', done);
    }
```

#### should not accept params in malformed paths

```ts
it('should not accept params in malformed paths', function (done) {
      var app = express();

      app.get('/:name', function (req, res) {
        res.send(req.params.name);
      });

      request(app)
        .get('/%foobar')
        .expect(400, done);
    }
```

#### should not decode spaces

```ts
it('should not decode spaces', function (done) {
      var app = express();

      app.get('/:name', function (req, res) {
        res.send(req.params.name);
      });

      request(app)
        .get('/foo+bar')
        .expect('foo+bar', done);
    }
```

#### should work with unicode

```ts
it('should work with unicode', function (done) {
      var app = express();

      app.get('/:name', function (req, res) {
        res.send(req.params.name);
      });

      request(app)
        .get('/%ce%b1')
        .expect('\u03b1', done);
    }
```

#### should be .use()able

```ts
it('should be .use()able', function (done) {
    var app = express();

    var calls = [];

    app.use(function (req, res, next) {
      calls.push('before');
      next();
    });

    app.get('/', function (req, res, next) {
      calls.push('GET /')
      next();
    });

    app.use(function (req, res, next) {
      calls.push('after');
      res.json(calls)
    });

    request(app)
      .get('/')
      .expect(200, ['before', 'GET /', 'after'], done)
  }
```

#### should match the pathname only

```ts
it('should match the pathname only', function (done) {
      var app = express();

      app.get(/^\/user\/[0-9]+$/, function (req, res) {
        res.end('user');
      });

      request(app)
        .get('/user/12?foo=bar')
        .expect('user', done);
    }
```

#### should populate req.params with the captures

```ts
it('should populate req.params with the captures', function (done) {
      var app = express();

      app.get(/^\/user\/([0-9]+)\/(view|edit)?$/, function (req, res) {
        var id = req.params[0]
          , op = req.params[1];
        res.end(op + 'ing user ' + id);
      });

      request(app)
        .get('/user/10/edit')
        .expect('editing user 10', done);
    }
```

#### should populate req.params with named captures

```ts
it('should populate req.params with named captures', function (done) {
        var app = express();
        var re = new RegExp('^/user/(?<userId>[0-9]+)/(view|edit)?$');

        app.get(re, function (req, res) {
          var id = req.params.userId
            , op = req.params[0];
          res.end(op + 'ing user ' + id);
        });

        request(app)
          .get('/user/10/edit')
          .expect('editing user 10', done);
      }
```

#### should ensure regexp matches path prefix

```ts
it('should ensure regexp matches path prefix', function (done) {
      var app = express()
      var p = []

      app.use(/\/api.*/, function (req, res, next) {
        p.push('a')
        next()
      })
      app.use(/api/, function (req, res, next) {
        p.push('b')
        next()
      })
      app.use(/\/test/, function (req, res, next) {
        p.push('c')
        next()
      })
      app.use(function (req, res) {
        res.end()
      })

      request(app)
        .get('/test/api/1234')
        .expect(200, function (err) {
          if (err) return done(err)
          assert.deepEqual(p, ['c'])
          done()
        })
    }
```

#### should be disabled by default

```ts
it('should be disabled by default', function (done) {
      var app = express();

      app.get('/user', function (req, res) {
        res.end('tj');
      });

      request(app)
        .get('/USER')
        .expect('tj', done);
    }
```

#### should match identical casing

```ts
it('should match identical casing', function (done) {
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/uSer')
          .expect('tj', done);
      }
```

#### should not match otherwise

```ts
it('should not match otherwise', function (done) {
        var app = express();

        app.enable('case sensitive routing');

        app.get('/uSer', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user')
          .expect(404, done);
      }
```

#### should overwrite existing req.params by default

```ts
it('should overwrite existing req.params by default', function (done) {
      var app = express();
      var router = new express.Router();

      router.get('/:action', function (req, res) {
        res.send(req.params);
      });

      app.use('/user/:user', router);

      request(app)
        .get('/user/1/get')
        .expect(200, '{"action":"get"}', done);
    }
```

#### should allow merging existing req.params

```ts
it('should allow merging existing req.params', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:action', function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use('/user/:user', router);

      request(app)
        .get('/user/tj/get')
        .expect(200, '[["action","get"],["user","tj"]]', done);
    }
```

#### should use params from router

```ts
it('should use params from router', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:thing', function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use('/user/:thing', router);

      request(app)
        .get('/user/tj/get')
        .expect(200, '[["thing","get"]]', done);
    }
```

#### should merge numeric indices req.params

```ts
it('should merge numeric indices req.params', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get(/^\/(.*)\.(.*)/, function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use(/^\/user\/id:(\d+)/, router);

      request(app)
        .get('/user/id:10/profile.json')
        .expect(200, '[["0","10"],["1","profile"],["2","json"]]', done);
    }
```

#### should merge numeric indices req.params when more in parent

```ts
it('should merge numeric indices req.params when more in parent', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get(/\/(.*)/, function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use(/^\/user\/id:(\d+)\/name:(\w+)/, router);

      request(app)
        .get('/user/id:10/name:tj/profile')
        .expect(200, '[["0","10"],["1","tj"],["2","profile"]]', done);
    }
```

#### should merge numeric indices req.params when parent has same number

```ts
it('should merge numeric indices req.params when parent has same number', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get(/\/name:(\w+)/, function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use(/\/user\/id:(\d+)/, router);

      request(app)
        .get('/user/id:10/name:tj')
        .expect(200, '[["0","10"],["1","tj"]]', done);
    }
```

#### should ignore invalid incoming req.params

```ts
it('should ignore invalid incoming req.params', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get('/:name', function (req, res) {
        var keys = Object.keys(req.params).sort();
        res.send(keys.map(function (k) { return [k, req.params[k]] }));
      });

      app.use('/user/', function (req, res, next) {
        req.params = 3; // wat?
        router(req, res, next);
      });

      request(app)
        .get('/user/tj')
        .expect(200, '[["name","tj"]]', done);
    }
```

#### should restore req.params

```ts
it('should restore req.params', function (done) {
      var app = express();
      var router = new express.Router({ mergeParams: true });

      router.get(/\/user:(\w+)\//, function (req, res, next) {
        next();
      });

      app.use(/\/user\/id:(\d+)/, function (req, res, next) {
        router(req, res, function (err) {
          var keys = Object.keys(req.params).sort();
          res.send(keys.map(function (k) { return [k, req.params[k]] }));
        });
      });

      request(app)
        .get('/user/id:42/user:tj/profile')
        .expect(200, '[["0","42"]]', done);
    }
```

#### should be optional by default

```ts
it('should be optional by default', function (done) {
      var app = express();

      app.get('/user', function (req, res) {
        res.end('tj');
      });

      request(app)
        .get('/user/')
        .expect('tj', done);
    }
```

#### should match trailing slashes

```ts
it('should match trailing slashes', function (done) {
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user/')
          .expect('tj', done);
      }
```

#### should pass-though middleware

```ts
it('should pass-though middleware', function (done) {
        var app = express();

        app.enable('strict routing');

        app.use(function (req, res, next) {
          res.setHeader('x-middleware', 'true');
          next();
        });

        app.get('/user/', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user/')
          .expect('x-middleware', 'true')
          .expect(200, 'tj', done);
      }
```

#### should pass-though mounted middleware

```ts
it('should pass-though mounted middleware', function (done) {
        var app = express();

        app.enable('strict routing');

        app.use('/user/', function (req, res, next) {
          res.setHeader('x-middleware', 'true');
          next();
        });

        app.get('/user/test/', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user/test/')
          .expect('x-middleware', 'true')
          .expect(200, 'tj', done);
      }
```

#### should match no slashes

```ts
it('should match no slashes', function (done) {
        var app = express();

        app.enable('strict routing');

        app.get('/user', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user')
          .expect('tj', done);
      }
```

#### should match middleware when omitting the trailing slash

```ts
it('should match middleware when omitting the trailing slash', function (done) {
        var app = express();

        app.enable('strict routing');

        app.use('/user/', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user')
          .expect(200, 'tj', done);
      }
```

#### should match middleware

```ts
it('should match middleware', function (done) {
        var app = express();

        app.enable('strict routing');

        app.use('/user', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user')
          .expect(200, 'tj', done);
      }
```

#### should match middleware when adding the trailing slash

```ts
it('should match middleware when adding the trailing slash', function (done) {
        var app = express();

        app.enable('strict routing');

        app.use('/user', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user/')
          .expect(200, 'tj', done);
      }
```

#### should fail when omitting the trailing slash

```ts
it('should fail when omitting the trailing slash', function (done) {
        var app = express();

        app.enable('strict routing');

        app.get('/user/', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user')
          .expect(404, done);
      }
```

#### should fail when adding the trailing slash

```ts
it('should fail when adding the trailing slash', function (done) {
        var app = express();

        app.enable('strict routing');

        app.get('/user', function (req, res) {
          res.end('tj');
        });

        request(app)
          .get('/user/')
          .expect(404, done);
      }
```

#### should allow literal "."

```ts
it('should allow literal "."', function (done) {
    var app = express();

    app.get('/api/users/:from..:to', function (req, res) {
      var from = req.params.from
        , to = req.params.to;

      res.end('users from ' + from + ' to ' + to);
    });

    request(app)
      .get('/api/users/1..50')
      .expect('users from 1 to 50', done);
  }
```

#### should denote a capture group

```ts
it('should denote a capture group', function (done) {
      var app = express();

      app.get('/user/:user', function (req, res) {
        res.end(req.params.user);
      });

      request(app)
        .get('/user/tj')
        .expect('tj', done);
    }
```

#### should match a single segment only

```ts
it('should match a single segment only', function (done) {
      var app = express();

      app.get('/user/:user', function (req, res) {
        res.end(req.params.user);
      });

      request(app)
        .get('/user/tj/edit')
        .expect(404, done);
    }
```

#### should allow several capture groups

```ts
it('should allow several capture groups', function (done) {
      var app = express();

      app.get('/user/:user/:op', function (req, res) {
        res.end(req.params.op + 'ing ' + req.params.user);
      });

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', done);
    }
```

#### should work following a partial capture group

```ts
it('should work following a partial capture group', function (done) {
      var app = express();
      var cb = after(2, done);

      app.get('/user{s}/:user/:op', function (req, res) {
        res.end(req.params.op + 'ing ' + req.params.user + (req.url.startsWith('/users') ? ' (old)' : ''));
      });

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', cb);

      request(app)
        .get('/users/tj/edit')
        .expect('editing tj (old)', cb);
    }
```

#### should work inside literal parenthesis

```ts
it('should work inside literal parenthesis', function (done) {
      var app = express();

      app.get('/:user\\(:op\\)', function (req, res) {
        res.end(req.params.op + 'ing ' + req.params.user);
      });

      request(app)
        .get('/tj(edit)')
        .expect('editing tj', done);
    }
```

#### should work in array of paths

```ts
it('should work in array of paths', function (done) {
      var app = express();
      var cb = after(2, done);

      app.get(['/user/:user/poke', '/user/:user/pokes'], function (req, res) {
        res.end('poking ' + req.params.user);
      });

      request(app)
        .get('/user/tj/poke')
        .expect('poking tj', cb);

      request(app)
        .get('/user/tj/pokes')
        .expect('poking tj', cb);
    }
```

#### should denote an optional capture group

```ts
it('should denote an optional capture group', function (done) {
      var app = express();

      app.get('/user/:user{/:op}', function (req, res) {
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
        .get('/user/tj')
        .expect('viewing tj', done);
    }
```

#### should populate the capture group

```ts
it('should populate the capture group', function (done) {
      var app = express();

      app.get('/user/:user{/:op}', function (req, res) {
        var op = req.params.op || 'view';
        res.end(op + 'ing ' + req.params.user);
      });

      request(app)
        .get('/user/tj/edit')
        .expect('editing tj', done);
    }
```

#### should match one segment

```ts
it('should match one segment', function (done) {
      var app = express()

      app.get('/user/*user', function (req, res) {
        res.end(req.params.user[0])
      })

      request(app)
        .get('/user/122')
        .expect('122', done)
    }
```

#### should match many segments

```ts
it('should match many segments', function (done) {
      var app = express()

      app.get('/user/*user', function (req, res) {
        res.end(req.params.user.join('/'))
      })

      request(app)
        .get('/user/1/2/3/4')
        .expect('1/2/3/4', done)
    }
```

#### should match zero segments

```ts
it('should match zero segments', function (done) {
      var app = express()

      app.get('/user{/*user}', function (req, res) {
        res.end(req.params.user)
      })

      request(app)
        .get('/user')
        .expect('', done)
    }
```

#### should match one segment

```ts
it('should match one segment', function (done) {
      var app = express()

      app.get('/user/*user', function (req, res) {
        res.end(req.params.user[0])
      })

      request(app)
        .get('/user/122')
        .expect(200, '122', done)
    }
```

#### should match many segments

```ts
it('should match many segments', function (done) {
      var app = express()

      app.get('/user/*user', function (req, res) {
        res.end(req.params.user.join('/'))
      })

      request(app)
        .get('/user/1/2/3/4')
        .expect(200, '1/2/3/4', done)
    }
```

#### should not match zero segments

```ts
it('should not match zero segments', function (done) {
      var app = express()

      app.get('/user/*user', function (req, res) {
        res.end(req.params.user)
      })

      request(app)
        .get('/user')
        .expect(404, done)
    }
```

#### should denote a format

```ts
it('should denote a format', function (done) {
      var app = express();
      var cb = after(2, done)

      app.get('/:name.:format', function (req, res) {
        res.end(req.params.name + ' as ' + req.params.format);
      });

      request(app)
        .get('/foo.json')
        .expect(200, 'foo as json', cb)

      request(app)
        .get('/foo')
        .expect(404, cb)
    }
```

#### should denote an optional format

```ts
it('should denote an optional format', function (done) {
      var app = express();
      var cb = after(2, done)

      app.get('/:name{.:format}', function (req, res) {
        res.end(req.params.name + ' as ' + (req.params.format || 'html'));
      });

      request(app)
        .get('/foo')
        .expect(200, 'foo as html', cb)

      request(app)
        .get('/foo.json')
        .expect(200, 'foo as json', cb)
    }
```

#### should continue lookup

```ts
it('should continue lookup', function (done) {
      var app = express()
        , calls = [];

      app.get('/foo{/:bar}', function (req, res, next) {
        calls.push('/foo/:bar?');
        next();
      });

      app.get('/bar', function () {
        assert(0);
      });

      app.get('/foo', function (req, res, next) {
        calls.push('/foo');
        next();
      });

      app.get('/foo', function (req, res) {
        calls.push('/foo 2');
        res.json(calls)
      });

      request(app)
        .get('/foo')
        .expect(200, ['/foo/:bar?', '/foo', '/foo 2'], done)
    }
```

#### should jump to next route

```ts
it('should jump to next route', function (done) {
      var app = express()

      function fn(req, res, next) {
        res.set('X-Hit', '1')
        next('route')
      }

      app.get('/foo', fn, function (req, res) {
        res.end('failure')
      });

      app.get('/foo', function (req, res) {
        res.end('success')
      })

      request(app)
        .get('/foo')
        .expect('X-Hit', '1')
        .expect(200, 'success', done)
    }
```

#### should jump out of router

```ts
it('should jump out of router', function (done) {
      var app = express()
      var router = express.Router()

      function fn(req, res, next) {
        res.set('X-Hit', '1')
        next('router')
      }

      router.get('/foo', fn, function (req, res) {
        res.end('failure')
      })

      router.get('/foo', function (req, res) {
        res.end('failure')
      })

      app.use(router)

      app.get('/foo', function (req, res) {
        res.end('success')
      })

      request(app)
        .get('/foo')
        .expect('X-Hit', '1')
        .expect(200, 'success', done)
    }
```

#### should break out of app.router

```ts
it('should break out of app.router', function (done) {
      var app = express()
        , calls = [];

      app.get('/foo{/:bar}', function (req, res, next) {
        calls.push('/foo/:bar?');
        next();
      });

      app.get('/bar', function () {
        assert(0);
      });

      app.get('/foo', function (req, res, next) {
        calls.push('/foo');
        next(new Error('fail'));
      });

      app.get('/foo', function () {
        assert(0);
      });

      app.use(function (err, req, res, next) {
        res.json({
          calls: calls,
          error: err.message
        })
      })

      request(app)
        .get('/foo')
        .expect(200, { calls: ['/foo/:bar?', '/foo'], error: 'fail' }, done)
    }
```

#### should call handler in same route, if exists

```ts
it('should call handler in same route, if exists', function (done) {
      var app = express();

      function fn1(req, res, next) {
        next(new Error('boom!'));
      }

      function fn2(req, res, next) {
        res.send('foo here');
      }

      function fn3(err, req, res, next) {
        res.send('route go ' + err.message);
      }

      app.get('/foo', fn1, fn2, fn3);

      app.use(function (err, req, res, next) {
        res.end('error!');
      })

      request(app)
        .get('/foo')
        .expect('route go boom!', done)
    }
```

#### should pass rejected promise value

```ts
it('should pass rejected promise value', function (done) {
      var app = express()
      var router = new express.Router()

      router.use(function createError(req, res, next) {
        return Promise.reject(new Error('boom!'))
      })

      router.use(function sawError(err, req, res, next) {
        res.send('saw ' + err.name + ': ' + err.message)
      })

      app.use(router)

      request(app)
        .get('/')
        .expect(200, 'saw Error: boom!', done)
    }
```

#### should pass rejected promise without value

```ts
it('should pass rejected promise without value', function (done) {
      var app = express()
      var router = new express.Router()

      router.use(function createError(req, res, next) {
        return Promise.reject()
      })

      router.use(function sawError(err, req, res, next) {
        res.send('saw ' + err.name + ': ' + err.message)
      })

      app.use(router)

      request(app)
        .get('/')
        .expect(200, 'saw Error: Rejected promise', done)
    }
```

#### should ignore resolved promise

```ts
it('should ignore resolved promise', function (done) {
      var app = express()
      var router = new express.Router()

      router.use(function createError(req, res, next) {
        res.send('saw GET /foo')
        return Promise.resolve('foo')
      })

      router.use(function () {
        done(new Error('Unexpected middleware invoke'))
      })

      app.use(router)

      request(app)
        .get('/foo')
        .expect(200, 'saw GET /foo', done)
    }
```

#### should pass rejected promise value

```ts
it('should pass rejected promise value', function (done) {
        var app = express()
        var router = new express.Router()

        router.use(function createError(req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        router.use(function handleError(err, req, res, next) {
          return Promise.reject(new Error('caught: ' + err.message))
        })

        router.use(function sawError(err, req, res, next) {
          res.send('saw ' + err.name + ': ' + err.message)
        })

        app.use(router)

        request(app)
          .get('/')
          .expect(200, 'saw Error: caught: boom!', done)
      }
```

#### should pass rejected promise without value

```ts
it('should pass rejected promise without value', function (done) {
        var app = express()
        var router = new express.Router()

        router.use(function createError(req, res, next) {
          return Promise.reject()
        })

        router.use(function handleError(err, req, res, next) {
          return Promise.reject(new Error('caught: ' + err.message))
        })

        router.use(function sawError(err, req, res, next) {
          res.send('saw ' + err.name + ': ' + err.message)
        })

        app.use(router)

        request(app)
          .get('/')
          .expect(200, 'saw Error: caught: Rejected promise', done)
      }
```

#### should ignore resolved promise

```ts
it('should ignore resolved promise', function (done) {
        var app = express()
        var router = new express.Router()

        router.use(function createError(req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        router.use(function handleError(err, req, res, next) {
          res.send('saw ' + err.name + ': ' + err.message)
          return Promise.resolve('foo')
        })

        router.use(function () {
          done(new Error('Unexpected middleware invoke'))
        })

        app.use(router)

        request(app)
          .get('/foo')
          .expect(200, 'saw Error: boom!', done)
      }
```

#### should allow rewriting of the url

```ts
it('should allow rewriting of the url', function (done) {
    var app = express();

    app.get('/account/edit', function (req, res, next) {
      req.user = { id: 12 }; // faux authenticated user
      req.url = '/user/' + req.user.id + '/edit';
      next();
    });

    app.get('/user/:id/edit', function (req, res) {
      res.send('editing user ' + req.params.id);
    });

    request(app)
      .get('/account/edit')
      .expect('editing user 12', done);
  }
```

#### should run in order added

```ts
it('should run in order added', function (done) {
    var app = express();
    var path = [];

    app.get('/*path', function (req, res, next) {
      path.push(0);
      next();
    });

    app.get('/user/:id', function (req, res, next) {
      path.push(1);
      next();
    });

    app.use(function (req, res, next) {
      path.push(2);
      next();
    });

    app.all('/user/:id', function (req, res, next) {
      path.push(3);
      next();
    });

    app.get('/*splat', function (req, res, next) {
      path.push(4);
      next();
    });

    app.use(function (req, res, next) {
      path.push(5);
      res.end(path.join(','))
    });

    request(app)
      .get('/user/1')
      .expect(200, '0,1,2,3,4,5', done);
  }
```

#### should be chainable

```ts
it('should be chainable', function () {
    var app = express();
    assert.strictEqual(app.get('/', function () { }), app)
  }
```

#### should not use disposed router/middleware

```ts
it('should not use disposed router/middleware', function (done) {
    // more context: https://github.com/expressjs/express/issues/5743#issuecomment-2277148412

    var app = express();
    var router = new express.Router();

    router.use(function (req, res, next) {
      res.setHeader('old', 'foo');
      next();
    });

    app.use(function (req, res, next) {
      return router.handle(req, res, next);
    });

    app.get('/', function (req, res, next) {
      res.send('yee');
      next();
    });

    request(app)
      .get('/')
      .expect('old', 'foo')
      .expect(function (res) {
        if (typeof res.headers['new'] !== 'undefined') {
          throw new Error('`new` header should not be present');
        }
      })
      .expect(200, 'yee', function (err, res) {
        if (err) return done(err);

        router = new express.Router();

        router.use(function (req, res, next) {
          res.setHeader('new', 'bar');
          next();
        });

        request(app)
          .get('/')
          .expect('new', 'bar')
          .expect(function (res) {
            if (typeof res.headers['old'] !== 'undefined') {
              throw new Error('`old` header should not be present');
            }
          })
          .expect(200, 'yee', done);
      });
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.send.js

#### should set body to ""

```ts
it('should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send();
      });

      request(app)
      .get('/')
      .expect(200, '', done);
    }
```

#### should set body to ""

```ts
it('should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(null);
      });

      request(app)
      .get('/')
      .expect('Content-Length', '0')
      .expect(200, '', done);
    }
```

#### should set body to ""

```ts
it('should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(undefined);
      });

      request(app)
      .get('/')
      .expect(200, '', done);
    }
```

#### should send as application/json

```ts
it('should send as application/json', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(1000);
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '1000', done)
    }
```

#### should send as html

```ts
it('should send as html', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('<p>hey</p>');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, '<p>hey</p>', done);
    }
```

#### should set ETag

```ts
it('should set ETag', function (done) {
      var app = express();

      app.use(function (req, res) {
        var str = Array(1000).join('-');
        res.send(str);
      });

      request(app)
      .get('/')
      .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
      .expect(200, done);
    }
```

#### should not override Content-Type

```ts
it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    }
```

#### should override charset in Content-Type

```ts
it('should override charset in Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    }
```

#### should keep charset in Content-Type for Buffers

```ts
it('should keep charset in Content-Type for Buffers', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send(Buffer.from('hi'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=iso-8859-1')
      .expect(200, 'hi', done);
    }
```

#### should send as octet-stream

```ts
it('should send as octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(Buffer.from('hello'))
      });

      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/octet-stream')
        .expect(utils.shouldHaveBody(Buffer.from('hello')))
        .end(done)
    }
```

#### should set ETag

```ts
it('should set ETag', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.send(Buffer.alloc(999, '-'))
      });

      request(app)
      .get('/')
      .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
      .expect(200, done);
    }
```

#### should not override Content-Type

```ts
it('should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send(Buffer.from('hey'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    }
```

#### should accept Uint8Array

```ts
it('should accept Uint8Array', function(done){
      var app = express();
      app.use(function(req, res){
        const encodedHey = new TextEncoder().encode("hey");
        res.set("Content-Type", "text/plain").send(encodedHey);
      })

      request(app)
        .get("/")
        .expect("Content-Type", "text/plain; charset=utf-8")
        .expect(200, "hey", done);
    }
```

#### should not override ETag

```ts
it('should not override ETag', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.type('text/plain').set('ETag', '"foo"').send(Buffer.from('hey'))
      })

      request(app)
      .get('/')
      .expect('ETag', '"foo"')
      .expect(200, 'hey', done)
    }
```

#### should send as application/json

```ts
it('should send as application/json', function(done){
      var app = express();

      app.use(function(req, res){
        res.send({ name: 'tobi' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"name":"tobi"}', done)
    }
```

#### should ignore the body

```ts
it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('yay');
      });

      request(app)
        .head('/')
        .expect(200)
        .expect(utils.shouldNotHaveBody())
        .end(done)
    }
```

#### should strip Content-* fields, Transfer-Encoding field, and body

```ts
it('should strip Content-* fields, Transfer-Encoding field, and body', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(204).set('Transfer-Encoding', 'chunked').send('foo');
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Content-Type'))
      .expect(utils.shouldNotHaveHeader('Content-Length'))
      .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
      .expect(204, '', done);
    }
```

#### should strip Transfer-Encoding field and body, set Content-Length

```ts
it('should strip Transfer-Encoding field and body, set Content-Length', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.status(205).set('Transfer-Encoding', 'chunked').send('foo')
      })

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
        .expect('Content-Length', '0')
        .expect(205, '', done)
    }
```

#### should always check regardless of length

```ts
it('should always check regardless of length', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res, next){
      res.set('ETag', etag);
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect(304, done);
  }
```

#### should respond with 304 Not Modified when fresh

```ts
it('should respond with 304 Not Modified when fresh', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res){
      var str = Array(1000).join('-');
      res.set('ETag', etag);
      res.send(str);
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect(304, done);
  }
```

#### should not perform freshness check unless 2xx or 304

```ts
it('should not perform freshness check unless 2xx or 304', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res, next){
      res.status(500);
      res.set('ETag', etag);
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect('hey')
    .expect(500, done);
  }
```

#### should not support jsonp callbacks

```ts
it('should not support jsonp callbacks', function(done){
    var app = express();

    app.use(function(req, res){
      res.send({ foo: 'bar' });
    });

    request(app)
    .get('/?callback=foo')
    .expect('{"foo":"bar"}', done);
  }
```

#### should be chainable

```ts
it('should be chainable', function (done) {
    var app = express()

    app.use(function (req, res) {
      assert.equal(res.send('hey'), res)
    })

    request(app)
    .get('/')
    .expect(200, 'hey', done)
  }
```

#### should send ETag

```ts
it('should send ETag', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send('kajdslfkasdf');
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
        .expect(200, done);
      }
```

#### should send ETag in response to ' + method.toUpperCase() + ' request

```ts
it('should send ETag in response to ' + method.toUpperCase() + ' request', function (done) {
          if (method === 'query' && shouldSkipQuery(process.versions.node)) {
            this.skip()
          }
          var app = express();

          app[method]('/', function (req, res) {
            res.send('kajdslfkasdf');
          });

          request(app)
          [method]('/')
          .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
          .expect(200, done);
        }
```

#### should send ETag for empty string response

```ts
it('should send ETag for empty string response', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send('');
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        .expect(200, done);
      }
```

#### should send ETag for long response

```ts
it('should send ETag for long response', function (done) {
        var app = express();

        app.use(function (req, res) {
          var str = Array(1000).join('-');
          res.send(str);
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
        .expect(200, done);
      }
```

#### should not override ETag when manually set

```ts
it('should not override ETag when manually set', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.set('etag', '"asdf"');
          res.send('hello!');
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', '"asdf"')
        .expect(200, done);
      }
```

#### should not send ETag for res.send()

```ts
it('should not send ETag for res.send()', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send();
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      }
```

#### should send no ETag

```ts
it('should send no ETag', function (done) {
        var app = express();

        app.use(function (req, res) {
          var str = Array(1000).join('-');
          res.send(str);
        });

        app.disable('etag');

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      }
```

#### should send ETag when manually set

```ts
it('should send ETag when manually set', function (done) {
        var app = express();

        app.disable('etag');

        app.use(function (req, res) {
          res.set('etag', '"asdf"');
          res.send('hello!');
        });

        request(app)
        .get('/')
        .expect('ETag', '"asdf"')
        .expect(200, done);
      }
```

#### should send strong ETag

```ts
it('should send strong ETag', function (done) {
        var app = express();

        app.set('etag', 'strong');

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', '"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
        .expect(200, done);
      }
```

#### should send weak ETag

```ts
it('should send weak ETag', function (done) {
        var app = express();

        app.set('etag', 'weak');

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', 'W/"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
        .expect(200, done)
      }
```

#### should send custom ETag

```ts
it('should send custom ETag', function (done) {
        var app = express();

        app.set('etag', function (body, encoding) {
          var chunk = !Buffer.isBuffer(body)
            ? Buffer.from(body, encoding)
            : body;
          assert.strictEqual(chunk.toString(), 'hello, world!')
          return '"custom"';
        });

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', '"custom"')
        .expect(200, done);
      }
```

#### should not send falsy ETag

```ts
it('should not send falsy ETag', function (done) {
        var app = express();

        app.set('etag', function (body, encoding) {
          return undefined;
        });

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.cookie.js

#### should generate a JSON cookie

```ts
it('should generate a JSON cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('user', { name: 'tobi' }).end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'user=j%3A%7B%22name%22%3A%22tobi%22%7D; Path=/')
      .expect(200, done)
    }
```

#### should set a cookie

```ts
it('should set a cookie', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi').end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'name=tobi; Path=/')
      .expect(200, done)
    }
```

#### should allow multiple calls

```ts
it('should allow multiple calls', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi');
        res.cookie('age', 1);
        res.cookie('gender', '?');
        res.end();
      });

      request(app)
        .get('/')
        .expect('Set-Cookie', 'name=tobi; Path=/,age=1; Path=/,gender=%3F; Path=/')
        .expect(200, done)
    }
```

#### should set params

```ts
it('should set params', function(done){
      var app = express();

      app.use(function(req, res){
        res.cookie('name', 'tobi', { httpOnly: true, secure: true });
        res.end();
      });

      request(app)
      .get('/')
      .expect('Set-Cookie', 'name=tobi; Path=/; HttpOnly; Secure')
      .expect(200, done)
    }
```

#### should throw on invalid date

```ts
it('should throw on invalid date', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { expires: new Date(NaN) })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option expires is invalid/, done)
      }
```

#### should set partitioned

```ts
it('should set partitioned', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { partitioned: true });
          res.end();
        });

        request(app)
          .get('/')
          .expect('Set-Cookie', 'name=tobi; Path=/; Partitioned')
          .expect(200, done)
      }
```

#### should set relative expires

```ts
it('should set relative expires', function(done){
        var app = express();

        app.use(function(req, res){
          res.cookie('name', 'tobi', { maxAge: 1000 });
          res.end();
        });

        request(app)
          .get('/')
          .expect('Set-Cookie', /name=tobi; Max-Age=1; Path=\/; Expires=/)
          .expect(200, done)
      }
```

#### should set max-age

```ts
it('should set max-age', function(done){
        var app = express();

        app.use(function(req, res){
          res.cookie('name', 'tobi', { maxAge: 1000 });
          res.end();
        });

        request(app)
        .get('/')
        .expect('Set-Cookie', /Max-Age=1/, done)
      }
```

#### should not mutate the options object

```ts
it('should not mutate the options object', function(done){
        var app = express();

        var options = { maxAge: 1000 };
        var optionsCopy = { ...options };

        app.use(function(req, res){
          res.cookie('name', 'tobi', options)
          res.json(options)
        });

        request(app)
        .get('/')
        .expect(200, optionsCopy, done)
      }
```

#### should not throw on null

```ts
it('should not throw on null', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: null })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      }
```

#### should not throw on undefined

```ts
it('should not throw on undefined', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: undefined })
          res.end()
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Set-Cookie', 'name=tobi; Path=/')
          .end(done)
      }
```

#### should throw an error with invalid maxAge

```ts
it('should throw an error with invalid maxAge', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { maxAge: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option maxAge is invalid/, done)
      }
```

#### should set low priority

```ts
it('should set low priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'low' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Low/)
          .expect(200, done)
      }
```

#### should set medium priority

```ts
it('should set medium priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'medium' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=Medium/)
          .expect(200, done)
      }
```

#### should set high priority

```ts
it('should set high priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'high' })
          res.end()
        })

        request(app)
          .get('/')
          .expect('Set-Cookie', /Priority=High/)
          .expect(200, done)
      }
```

#### should throw with invalid priority

```ts
it('should throw with invalid priority', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.cookie('name', 'tobi', { priority: 'foobar' })
          res.end()
        })

        request(app)
          .get('/')
          .expect(500, /option priority is invalid/, done)
      }
```

#### should generate a signed JSON cookie

```ts
it('should generate a signed JSON cookie', function(done){
        var app = express();

        app.use(cookieParser('foo bar baz'));

        app.use(function(req, res){
          res.cookie('user', { name: 'tobi' }, { signed: true }).end();
        });

        request(app)
          .get('/')
          .expect('Set-Cookie', 'user=s%3Aj%3A%7B%22name%22%3A%22tobi%22%7D.K20xcwmDS%2BPb1rsD95o5Jm5SqWs1KteqdnynnB7jkTE; Path=/')
          .expect(200, done)
      }
```

#### should throw an error

```ts
it('should throw an error', function(done){
        var app = express();

        app.use(cookieParser());

        app.use(function(req, res){
          res.cookie('name', 'tobi', { signed: true }).end();
        });

        request(app)
        .get('/')
        .expect(500, /secret\S+ required for signed cookies/, done);
      }
```

#### should set a signed cookie

```ts
it('should set a signed cookie', function(done){
        var app = express();

        app.use(cookieParser('foo bar baz'));

        app.use(function(req, res){
          res.cookie('name', 'tobi', { signed: true }).end();
        });

        request(app)
        .get('/')
        .expect('Set-Cookie', 'name=s%3Atobi.xJjV2iZ6EI7C8E5kzwbfA9PVLl1ZR07UTnuTgQQ4EnQ; Path=/')
        .expect(200, done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.response.js

#### should extend the response prototype

```ts
it('should extend the response prototype', function(done){
      var app = express();

      app.response.shout = function(str){
        this.send(str.toUpperCase());
      };

      app.use(function(req, res){
        res.shout('hey');
      });

      request(app)
      .get('/')
      .expect('HEY', done);
    }
```

#### should only extend for the referenced app

```ts
it('should only extend for the referenced app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app2)
        .get('/')
        .expect(500, /(?:not a function|has no method)/, cb)
    }
```

#### should inherit to sub apps

```ts
it('should inherit to sub apps', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'FOO', cb)
    }
```

#### should allow sub app to override

```ts
it('should allow sub app to override', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app2.response.shout = function (str) {
        this.send(str + '!')
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/')
        .expect(200, 'FOO', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'foo!', cb)
    }
```

#### should not pollute parent app

```ts
it('should not pollute parent app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.response.shout = function (str) {
        this.send(str.toUpperCase())
      }

      app2.response.shout = function (str) {
        this.send(str + '!')
      }

      app1.use('/sub', app2)

      app1.get('/sub/foo', function (req, res) {
        res.shout('foo')
      })

      app2.get('/', function (req, res) {
        res.shout('foo')
      })

      request(app1)
        .get('/sub')
        .expect(200, 'foo!', cb)

      request(app1)
        .get('/sub/foo')
        .expect(200, 'FOO', cb)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.request.js

#### should extend the request prototype

```ts
it('should extend the request prototype', function(done){
      var app = express();

      app.request.querystring = function(){
        return require('node:url').parse(this.url).query;
      };

      app.use(function(req, res){
        res.end(req.querystring());
      });

      request(app)
      .get('/foo?name=tobi')
      .expect('name=tobi', done);
    }
```

#### should only extend for the referenced app

```ts
it('should only extend for the referenced app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app2)
        .get('/')
        .expect(500, /(?:not a function|has no method)/, cb)
    }
```

#### should inherit to sub apps

```ts
it('should inherit to sub apps', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'tobi', cb)
    }
```

#### should allow sub app to override

```ts
it('should allow sub app to override', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/')
        .expect(200, 'tobi', cb)

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)
    }
```

#### should not pollute parent app

```ts
it('should not pollute parent app', function (done) {
      var app1 = express()
      var app2 = express()
      var cb = after(2, done)

      app1.request.foobar = function () {
        return 'tobi'
      }

      app2.request.foobar = function () {
        return 'loki'
      }

      app1.use('/sub', app2)

      app1.get('/sub/foo', function (req, res) {
        res.send(req.foobar())
      })

      app2.get('/', function (req, res) {
        res.send(req.foobar())
      })

      request(app1)
        .get('/sub')
        .expect(200, 'loki', cb)

      request(app1)
        .get('/sub/foo')
        .expect(200, 'tobi', cb)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.accepts.js

#### should return true when Accept is not present

```ts
it('should return true when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .expect('yes', done);
    }
```

#### should return true when present

```ts
it('should return true when present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('yes', done);
    }
```

#### should return false otherwise

```ts
it('should return false otherwise', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts('json') ? 'yes' : 'no');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('no', done);
    }
```

#### should accept an argument list of type names

```ts
it('should accept an argument list of type names', function(done){
    var app = express();

    app.use(function(req, res, next){
      res.end(req.accepts('json', 'html'));
    });

    request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect('json', done);
  }
```

#### should return the first when Accept is not present

```ts
it('should return the first when Accept is not present', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['json', 'html']));
      });

      request(app)
      .get('/')
      .expect('json', done);
    }
```

#### should return the first acceptable type

```ts
it('should return the first acceptable type', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['json', 'html']));
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('html', done);
    }
```

#### should return false when no match is made

```ts
it('should return false when no match is made', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['text/html', 'application/json']) ? 'yup' : 'nope');
      });

      request(app)
      .get('/')
      .set('Accept', 'foo/bar, bar/baz')
      .expect('nope', done);
    }
```

#### should take quality into account

```ts
it('should take quality into account', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['text/html', 'application/json']));
      });

      request(app)
      .get('/')
      .set('Accept', '*/html; q=.5, application/json')
      .expect('application/json', done);
    }
```

#### should return the first acceptable type with canonical mime types

```ts
it('should return the first acceptable type with canonical mime types', function(done){
      var app = express();

      app.use(function(req, res, next){
        res.end(req.accepts(['application/json', 'text/html']));
      });

      request(app)
      .get('/')
      .set('Accept', '*/html')
      .expect('text/html', done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.use.js

#### should emit "mount" when mounted

```ts
it('should emit "mount" when mounted', function(done){
    var blog = express()
      , app = express();

    blog.on('mount', function(arg){
      assert.strictEqual(arg, app)
      done();
    });

    app.use(blog);
  }
```

#### should mount the app

```ts
it('should mount the app', function(done){
      var blog = express()
        , app = express();

      blog.get('/blog', function(req, res){
        res.end('blog');
      });

      app.use(blog);

      request(app)
      .get('/blog')
      .expect('blog', done);
    }
```

#### should support mount-points

```ts
it('should support mount-points', function(done){
      var blog = express()
        , forum = express()
        , app = express();
      var cb = after(2, done)

      blog.get('/', function(req, res){
        res.end('blog');
      });

      forum.get('/', function(req, res){
        res.end('forum');
      });

      app.use('/blog', blog);
      app.use('/forum', forum);

      request(app)
        .get('/blog')
        .expect(200, 'blog', cb)

      request(app)
        .get('/forum')
        .expect(200, 'forum', cb)
    }
```

#### should set the child\'s .parent

```ts
it('should set the child\'s .parent', function(){
      var blog = express()
        , app = express();

      app.use('/blog', blog);
      assert.strictEqual(blog.parent, app)
    }
```

#### should support dynamic routes

```ts
it('should support dynamic routes', function(done){
      var blog = express()
        , app = express();

      blog.get('/', function(req, res){
        res.end('success');
      });

      app.use('/post/:article', blog);

      request(app)
      .get('/post/once-upon-a-time')
      .expect('success', done);
    }
```

#### should support mounted app anywhere

```ts
it('should support mounted app anywhere', function(done){
      var cb = after(3, done);
      var blog = express()
        , other = express()
        , app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      blog.get('/', function(req, res){
        res.end('success');
      });

      blog.once('mount', function (parent) {
        assert.strictEqual(parent, app)
        cb();
      });
      other.once('mount', function (parent) {
        assert.strictEqual(parent, app)
        cb();
      });

      app.use('/post/:article', fn1, other, fn2, blog);

      request(app)
      .get('/post/once-upon-a-time')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('success', cb);
    }
```

#### should accept multiple arguments

```ts
it('should accept multiple arguments', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      app.use(fn1, fn2, function fn3(req, res) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      });

      request(app)
      .get('/')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should invoke middleware for all requests

```ts
it('should invoke middleware for all requests', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url);
      });

      request(app)
      .get('/')
      .expect(200, 'saw GET /', cb);

      request(app)
      .options('/')
      .expect(200, 'saw OPTIONS /', cb);

      request(app)
      .post('/foo')
      .expect(200, 'saw POST /foo', cb);
    }
```

#### should accept array of middleware

```ts
it('should accept array of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([fn1, fn2, fn3]);

      request(app)
      .get('/')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should accept multiple arrays of middleware

```ts
it('should accept multiple arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([fn1, fn2], [fn3]);

      request(app)
      .get('/')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should accept nested arrays of middleware

```ts
it('should accept nested arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use([[fn1], fn2], [fn3]);

      request(app)
      .get('/')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should require middleware

```ts
it('should require middleware', function () {
      var app = express()
      assert.throws(function () { app.use('/') }, 'TypeError: app.use() requires a middleware function')
    }
```

#### should reject string as middleware

```ts
it('should reject string as middleware', function () {
      var app = express()
      assert.throws(function () { app.use('/', 'foo') }, /argument handler must be a function/)
    }
```

#### should reject number as middleware

```ts
it('should reject number as middleware', function () {
      var app = express()
      assert.throws(function () { app.use('/', 42) }, /argument handler must be a function/)
    }
```

#### should reject null as middleware

```ts
it('should reject null as middleware', function () {
      var app = express()
      assert.throws(function () { app.use('/', null) }, /argument handler must be a function/)
    }
```

#### should reject Date as middleware

```ts
it('should reject Date as middleware', function () {
      var app = express()
      assert.throws(function () { app.use('/', new Date()) }, /argument handler must be a function/)
    }
```

#### should strip path from req.url

```ts
it('should strip path from req.url', function (done) {
      var app = express();

      app.use('/foo', function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url);
      });

      request(app)
      .get('/foo/bar')
      .expect(200, 'saw GET /bar', done);
    }
```

#### should accept multiple arguments

```ts
it('should accept multiple arguments', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      app.use('/foo', fn1, fn2, function fn3(req, res) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      });

      request(app)
      .get('/foo')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should invoke middleware for all requests starting with path

```ts
it('should invoke middleware for all requests starting with path', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use('/foo', function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url);
      });

      request(app)
      .get('/')
      .expect(404, cb);

      request(app)
      .post('/foo')
      .expect(200, 'saw POST /', cb);

      request(app)
      .post('/foo/bar')
      .expect(200, 'saw POST /bar', cb);
    }
```

#### should work if path has trailing slash

```ts
it('should work if path has trailing slash', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use('/foo/', function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url);
      });

      request(app)
      .get('/')
      .expect(404, cb);

      request(app)
      .post('/foo')
      .expect(200, 'saw POST /', cb);

      request(app)
      .post('/foo/bar')
      .expect(200, 'saw POST /bar', cb);
    }
```

#### should accept array of middleware

```ts
it('should accept array of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, fn2, fn3]);

      request(app)
      .get('/foo')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should accept multiple arrays of middleware

```ts
it('should accept multiple arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, fn2], [fn3]);

      request(app)
      .get('/foo')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should accept nested arrays of middleware

```ts
it('should accept nested arrays of middleware', function (done) {
      var app = express();

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.end();
      }

      app.use('/foo', [fn1, [fn2]], [fn3]);

      request(app)
      .get('/foo')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, done);
    }
```

#### should support array of paths

```ts
it('should support array of paths', function (done) {
      var app = express();
      var cb = after(3, done);

      app.use(['/foo/', '/bar'], function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl);
      });

      request(app)
      .get('/')
      .expect(404, cb);

      request(app)
      .get('/foo')
      .expect(200, 'saw GET / through /foo', cb);

      request(app)
      .get('/bar')
      .expect(200, 'saw GET / through /bar', cb);
    }
```

#### should support array of paths with middleware array

```ts
it('should support array of paths with middleware array', function (done) {
      var app = express();
      var cb = after(2, done);

      function fn1(req, res, next) {
        res.setHeader('x-fn-1', 'hit');
        next();
      }

      function fn2(req, res, next) {
        res.setHeader('x-fn-2', 'hit');
        next();
      }

      function fn3(req, res, next) {
        res.setHeader('x-fn-3', 'hit');
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl);
      }

      app.use(['/foo/', '/bar'], [[fn1], fn2], [fn3]);

      request(app)
      .get('/foo')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, 'saw GET / through /foo', cb);

      request(app)
      .get('/bar')
      .expect('x-fn-1', 'hit')
      .expect('x-fn-2', 'hit')
      .expect('x-fn-3', 'hit')
      .expect(200, 'saw GET / through /bar', cb);
    }
```

#### should support regexp path

```ts
it('should support regexp path', function (done) {
      var app = express();
      var cb = after(4, done);

      app.use(/^\/[a-z]oo/, function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl);
      });

      request(app)
      .get('/')
      .expect(404, cb);

      request(app)
      .get('/foo')
      .expect(200, 'saw GET / through /foo', cb);

      request(app)
      .get('/zoo/bear')
      .expect(200, 'saw GET /bear through /zoo/bear', cb);

      request(app)
      .get('/get/zoo')
      .expect(404, cb);
    }
```

#### should support empty string path

```ts
it('should support empty string path', function (done) {
      var app = express();

      app.use('', function (req, res) {
        res.send('saw ' + req.method + ' ' + req.url + ' through ' + req.originalUrl);
      });

      request(app)
      .get('/')
      .expect(200, 'saw GET / through /', done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.is.js

#### should return the type when matching

```ts
it('should return the type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

#### should return false when not matching

```ts
it('should return false when not matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('image/jpeg'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, 'false', done)
    }
```

#### should ignore charset

```ts
it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
      .post('/')
      .type('application/json; charset=UTF-8')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

#### should return false

```ts
it('should return false', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/json'))
      })

      request(app)
      .post('/')
      .send('{}')
      .expect(200, 'false', done)
    }
```

#### should lookup the mime type

```ts
it('should lookup the mime type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"json"', done)
    }
```

#### should return the full type when matching

```ts
it('should return the full type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/json'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

#### should return false when not matching

```ts
it('should return false when not matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/html'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, 'false', done)
    }
```

#### should ignore charset

```ts
it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('*/json'))
      })

      request(app)
      .post('/')
      .type('application/json; charset=UTF-8')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

#### should return the full type when matching

```ts
it('should return the full type when matching', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/*'))
      })

      request(app)
      .post('/')
      .type('application/json')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

#### should ignore charset

```ts
it('should ignore charset', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.is('application/*'))
      })

      request(app)
      .post('/')
      .type('application/json; charset=UTF-8')
      .send('{}')
      .expect(200, '"application/json"', done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.type.js

#### should set the Content-Type based on a filename

```ts
it('should set the Content-Type based on a filename', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('foo.js').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .end(done)
    }
```

#### should default to application/octet-stream

```ts
it('should default to application/octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('rawr').end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/octet-stream', done);
    }
```

#### should set the Content-Type with type/subtype

```ts
it('should set the Content-Type with type/subtype', function(done){
      var app = express();

      app.use(function(req, res){
        res.type('application/vnd.amazon.ebook')
          .end('var name = "tj";');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.amazon.ebook', done);
    }
```

#### should handle empty string gracefully

```ts
it('should handle empty string gracefully', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('').end('test');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/octet-stream')
        .end(done);
      }
```

#### should handle file extension with dots

```ts
it('should handle file extension with dots', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('.json').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      }
```

#### should handle multiple file extensions

```ts
it('should handle multiple file extensions', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('file.tar.gz').end('compressed');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/gzip')
        .end(done);
      }
```

#### should handle uppercase extensions

```ts
it('should handle uppercase extensions', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('FILE.JSON').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      }
```

#### should handle extension with special characters

```ts
it('should handle extension with special characters', function(done){
        var app = express();

        app.use(function(req, res){
          res.type('file@test.json').end('{"test": true}');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.json.js

#### should not support jsonp callbacks

```ts
it('should not support jsonp callbacks', function(done){
      var app = express();

      app.use(function(req, res){
        res.json({ foo: 'bar' });
      });

      request(app)
      .get('/?callback=foo')
      .expect('{"foo":"bar"}', done);
    }
```

#### should not override previous Content-Types

```ts
it('should not override previous Content-Types', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.json({ hello: 'world' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.example+json; charset=utf-8')
      .expect(200, '{"hello":"world"}', done);
    }
```

#### should respond with json for null

```ts
it('should respond with json for null', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(null);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, 'null', done)
      }
```

#### should respond with json for Number

```ts
it('should respond with json for Number', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(300);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '300', done)
      }
```

#### should respond with json for String

```ts
it('should respond with json for String', function(done){
        var app = express();

        app.use(function(req, res){
          res.json('str');
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '"str"', done)
      }
```

#### should respond with json

```ts
it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json(['foo', 'bar', 'baz']);
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '["foo","bar","baz"]', done)
      }
```

#### should respond with json

```ts
it('should respond with json', function(done){
        var app = express();

        app.use(function(req, res){
          res.json({ name: 'tobi' });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      }
```

#### should be undefined by default

```ts
it('should be undefined by default', function () {
        var app = express()
        assert.strictEqual(app.get('json escape'), undefined)
      }
```

#### should unicode escape HTML-sniffing characters

```ts
it('should unicode escape HTML-sniffing characters', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.json({ '&': '<script>' })
        })

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"\\u0026":"\\u003cscript\\u003e"}', done)
      }
```

#### should not break undefined escape

```ts
it('should not break undefined escape', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.json(undefined)
        })

        request(app)
          .get('/')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200, '', done)
      }
```

#### should be passed to JSON.stringify()

```ts
it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json replacer', function(key, val){
          return key[0] === '_'
            ? undefined
            : val;
        });

        app.use(function(req, res){
          res.json({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      }
```

#### should be undefined by default

```ts
it('should be undefined by default', function(){
        var app = express();
        assert(undefined === app.get('json spaces'));
      }
```

#### should be passed to JSON.stringify()

```ts
it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json spaces', 2);

        app.use(function(req, res){
          res.json({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}', done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.host.js

#### should return the Host when present

```ts
it('should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    }
```

#### should strip port number

```ts
it('should strip port number', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect(200, 'example.com:3000', done);
    }
```

#### should return undefined otherwise

```ts
it('should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.host));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    }
```

#### should work with IPv6 Host

```ts
it('should work with IPv6 Host', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]')
      .expect('[::1]', done);
    }
```

#### should work with IPv6 Host and port

```ts
it('should work with IPv6 Host and port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.host);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:3000')
      .expect(200, '[::1]:3000', done);
    }
```

#### should respect X-Forwarded-Host

```ts
it('should respect X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('example.com', done);
      }
```

#### should ignore X-Forwarded-Host if socket addr not trusted

```ts
it('should ignore X-Forwarded-Host if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('localhost', done);
      }
```

#### should default to Host

```ts
it('should default to Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      }
```

#### should respect X-Forwarded-Host

```ts
it('should respect X-Forwarded-Host', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.use(function (req, res) {
            res.end(req.host);
          });

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com')
          .expect('example.com', done);
        }
```

#### should ignore X-Forwarded-Host

```ts
it('should ignore X-Forwarded-Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.host);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil')
        .expect('localhost', done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.listen.js

#### should wrap with an HTTP server

```ts
it('should wrap with an HTTP server', function(done){
    var app = express();

    var server = app.listen(0, function () {
      server.close(done)
    });
  }
```

#### should callback on HTTP server errors

```ts
it('should callback on HTTP server errors', function (done) {
    var app1 = express()
    var app2 = express()

    var server1 = app1.listen(0, function (err) {
      assert(!err)
      app2.listen(server1.address().port, function (err) {
        assert(err.code === 'EADDRINUSE')
        server1.close()
        done()
      })
    })
  }
```

#### accepts port + hostname + backlog + callback

```ts
it('accepts port + hostname + backlog + callback', function (done) {
    const app = express();
    const server = app.listen(0, '127.0.0.1', 5, function () {
      const { address, port } = server.address();
      assert.strictEqual(address, '127.0.0.1');
      assert(Number.isInteger(port) && port > 0);
      // backlog isn’t directly inspectable, but if no error was thrown
      // we know it was accepted.
      server.close(done);
    });
  }
```

#### accepts just a callback (no args)

```ts
it('accepts just a callback (no args)', function (done) {
    const app = express();
    // same as app.listen(0, done)
    const server = app.listen();
    server.close(done);
  }
```

#### server.address() gives a { address, port, family } object

```ts
it('server.address() gives a { address, port, family } object', function (done) {
    const app = express();
    const server = app.listen(0, () => {
      const addr = server.address();
      assert(addr && typeof addr === 'object');
      assert.strictEqual(typeof addr.address, 'string');
      assert(Number.isInteger(addr.port) && addr.port > 0);
      assert(typeof addr.family === 'string');
      server.close(done);
    });
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/express.raw.js

#### should 400 when invalid content-length

```ts
it('should 400 when invalid content-length', function (done) {
    var app = express()

    app.use(function (req, res, next) {
      req.headers['content-length'] = '20' // bad length
      next()
    })

    app.use(express.raw())

    app.post('/', function (req, res) {
      if (Buffer.isBuffer(req.body)) {
        res.json({ buf: req.body.toString('hex') })
      } else {
        res.json(req.body)
      }
    })

    request(app)
      .post('/')
      .set('Content-Type', 'application/octet-stream')
      .send('stuff')
      .expect(400, /content length/, done)
  }
```

#### should handle duplicated middleware

```ts
it('should handle duplicated middleware', function (done) {
    var app = express()

    app.use(express.raw())
    app.use(express.raw())

    app.post('/', function (req, res) {
      if (Buffer.isBuffer(req.body)) {
        res.json({ buf: req.body.toString('hex') })
      } else {
        res.json(req.body)
      }
    })

    request(app)
      .post('/')
      .set('Content-Type', 'application/octet-stream')
      .send('the user is tobi')
      .expect(200, { buf: '746865207573657220697320746f6269' }, done)
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.hostname.js

#### should return the Host when present

```ts
it('should return the Host when present', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com')
      .expect('example.com', done);
    }
```

#### should strip port number

```ts
it('should strip port number', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', 'example.com:3000')
      .expect('example.com', done);
    }
```

#### should return undefined otherwise

```ts
it('should return undefined otherwise', function(done){
      var app = express();

      app.use(function(req, res){
        req.headers.host = null;
        res.end(String(req.hostname));
      });

      request(app)
      .post('/')
      .expect('undefined', done);
    }
```

#### should work with IPv6 Host

```ts
it('should work with IPv6 Host', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]')
      .expect('[::1]', done);
    }
```

#### should work with IPv6 Host and port

```ts
it('should work with IPv6 Host and port', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.hostname);
      });

      request(app)
      .post('/')
      .set('Host', '[::1]:3000')
      .expect('[::1]', done);
    }
```

#### should respect X-Forwarded-Host

```ts
it('should respect X-Forwarded-Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com:3000')
        .expect('example.com', done);
      }
```

#### should ignore X-Forwarded-Host if socket addr not trusted

```ts
it('should ignore X-Forwarded-Host if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'example.com')
        .expect('localhost', done);
      }
```

#### should default to Host

```ts
it('should default to Host', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect('example.com', done);
      }
```

#### should use the first value

```ts
it('should use the first value', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com, foobar.com')
          .expect(200, 'example.com', done)
        }
```

#### should remove OWS around comma

```ts
it('should remove OWS around comma', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com , foobar.com')
          .expect(200, 'example.com', done)
        }
```

#### should strip port number

```ts
it('should strip port number', function (done) {
          var app = express()

          app.enable('trust proxy')

          app.use(function (req, res) {
            res.send(req.hostname)
          })

          request(app)
          .get('/')
          .set('Host', 'localhost')
          .set('X-Forwarded-Host', 'example.com:8080 , foobar.com:8888')
          .expect(200, 'example.com', done)
        }
```

#### should ignore X-Forwarded-Host

```ts
it('should ignore X-Forwarded-Host', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.hostname);
        });

        request(app)
        .get('/')
        .set('Host', 'localhost')
        .set('X-Forwarded-Host', 'evil')
        .expect('localhost', done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.options.js

#### should default to the routes defined

```ts
it('should default to the routes defined', function(done){
    var app = express();

    app.post('/', function(){});
    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});

    request(app)
    .options('/users')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);
  }
```

#### should only include each method once

```ts
it('should only include each method once', function(done){
    var app = express();

    app.delete('/', function(){});
    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});
    app.get('/users', function(req, res){});

    request(app)
    .options('/users')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);
  }
```

#### should not be affected by app.all

```ts
it('should not be affected by app.all', function(done){
    var app = express();

    app.get('/', function(){});
    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});
    app.all('/users', function(req, res, next){
      res.setHeader('x-hit', '1');
      next();
    });

    request(app)
    .options('/users')
    .expect('x-hit', '1')
    .expect('Allow', 'GET, HEAD, PUT')
    .expect(200, 'GET, HEAD, PUT', done);
  }
```

#### should not respond if the path is not defined

```ts
it('should not respond if the path is not defined', function(done){
    var app = express();

    app.get('/users', function(req, res){});

    request(app)
    .options('/other')
    .expect(404, done);
  }
```

#### should forward requests down the middleware chain

```ts
it('should forward requests down the middleware chain', function(done){
    var app = express();
    var router = new express.Router();

    router.get('/users', function(req, res){});
    app.use(router);
    app.get('/other', function(req, res){});

    request(app)
    .options('/other')
    .expect('Allow', 'GET, HEAD')
    .expect(200, 'GET, HEAD', done);
  }
```

#### should pass error to callback

```ts
it('should pass error to callback', function (done) {
      var app = express();
      var router = express.Router();

      router.get('/users', function(req, res){});

      app.use(function (req, res, next) {
        res.writeHead(200);
        next();
      });
      app.use(router);
      app.use(function (err, req, res, next) {
        res.end('true');
      });

      request(app)
      .options('/users')
      .expect(200, 'true', done)
    }
```

#### should override the default behavior

```ts
it('should override the default behavior', function(done){
    var app = express();

    app.options('/users', function(req, res){
      res.set('Allow', 'GET');
      res.send('GET');
    });

    app.get('/users', function(req, res){});
    app.put('/users', function(req, res){});

    request(app)
    .options('/users')
    .expect('GET')
    .expect('Allow', 'GET', done);
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.jsonp.js

#### should respond with jsonp

```ts
it('should respond with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    }
```

#### should use first callback parameter with jsonp

```ts
it('should use first callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something&callback=somethingelse')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    }
```

#### should ignore object callback parameter with jsonp

```ts
it('should ignore object callback parameter with jsonp', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback[a]=something')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"count":1}', done)
    }
```

#### should allow renaming callback

```ts
it('should allow renaming callback', function(done){
      var app = express();

      app.set('jsonp callback name', 'clb');

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?clb=something')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /something\(\{"count":1\}\);/, done);
    }
```

#### should allow []

```ts
it('should allow []', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=callbacks[123]')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /callbacks\[123\]\(\{"count":1\}\);/, done);
    }
```

#### should disallow arbitrary js

```ts
it('should disallow arbitrary js', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({});
      });

      request(app)
      .get('/?callback=foo;bar()')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /foobar\(\{\}\);/, done);
    }
```

#### should escape utf whitespace

```ts
it('should escape utf whitespace', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ str: '\u2028 \u2029 woot' });
      });

      request(app)
      .get('/?callback=foo')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect(200, /foo\(\{"str":"\\u2028 \\u2029 woot"\}\);/, done);
    }
```

#### should not escape utf whitespace for json fallback

```ts
it('should not escape utf whitespace for json fallback', function(done){
      var app = express();

      app.use(function(req, res){
        res.jsonp({ str: '\u2028 \u2029 woot' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"str":"\u2028 \u2029 woot"}', done);
    }
```

#### should include security header and prologue

```ts
it('should include security header and prologue', function (done) {
      var app = express();

      app.use(function(req, res){
        res.jsonp({ count: 1 });
      });

      request(app)
      .get('/?callback=something')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, /^\/\*\*\//, done);
    }
```

#### should not override previous Content-Types with no callback

```ts
it('should not override previous Content-Types with no callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/vnd.example+json; charset=utf-8')
      .expect(utils.shouldNotHaveHeader('X-Content-Type-Options'))
      .expect(200, '{"hello":"world"}', done);
    }
```

#### should override previous Content-Types with callback

```ts
it('should override previous Content-Types with callback', function(done){
      var app = express();

      app.get('/', function(req, res){
        res.type('application/vnd.example+json');
        res.jsonp({ hello: 'world' });
      });

      request(app)
      .get('/?callback=cb')
      .expect('Content-Type', 'text/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, /cb\(\{"hello":"world"\}\);$/, done);
    }
```

#### should invoke callback with no arguments

```ts
it('should invoke callback with no arguments', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp(undefined)
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(\)/, done)
      }
```

#### should invoke callback with null

```ts
it('should invoke callback with null', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp(null)
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(null\)/, done)
      }
```

#### should invoke callback with a string

```ts
it('should invoke callback with a string', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp('tobi')
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\("tobi"\)/, done)
      }
```

#### should invoke callback with a number

```ts
it('should invoke callback with a number', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp(42)
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(42\)/, done)
      }
```

#### should invoke callback with an array

```ts
it('should invoke callback with an array', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp(['foo', 'bar', 'baz'])
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(\["foo","bar","baz"\]\)/, done)
      }
```

#### should invoke callback with an object

```ts
it('should invoke callback with an object', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.jsonp({ name: 'tobi' })
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(\{"name":"tobi"\}\)/, done)
      }
```

#### should be undefined by default

```ts
it('should be undefined by default', function () {
        var app = express()
        assert.strictEqual(app.get('json escape'), undefined)
      }
```

#### should unicode escape HTML-sniffing characters

```ts
it('should unicode escape HTML-sniffing characters', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.jsonp({ '&': '\u2028<script>\u2029' })
        })

        request(app)
        .get('/?callback=foo')
        .expect('Content-Type', 'text/javascript; charset=utf-8')
        .expect(200, /foo\({"\\u0026":"\\u2028\\u003cscript\\u003e\\u2029"}\)/, done)
      }
```

#### should not break undefined escape

```ts
it('should not break undefined escape', function (done) {
        var app = express()

        app.enable('json escape')

        app.use(function (req, res) {
          res.jsonp(undefined)
        })

        request(app)
          .get('/?callback=cb')
          .expect('Content-Type', 'text/javascript; charset=utf-8')
          .expect(200, /cb\(\)/, done)
      }
```

#### should be passed to JSON.stringify()

```ts
it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json replacer', function(key, val){
          return key[0] === '_'
            ? undefined
            : val;
        });

        app.use(function(req, res){
          res.jsonp({ name: 'tobi', _id: 12345 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{"name":"tobi"}', done)
      }
```

#### should be undefined by default

```ts
it('should be undefined by default', function(){
        var app = express();
        assert(undefined === app.get('json spaces'));
      }
```

#### should be passed to JSON.stringify()

```ts
it('should be passed to JSON.stringify()', function(done){
        var app = express();

        app.set('json spaces', 2);

        app.use(function(req, res){
          res.jsonp({ name: 'tobi', age: 2 });
        });

        request(app)
        .get('/')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, '{\n  "name": "tobi",\n  "age": 2\n}', done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.subdomains.js

#### should return an array

```ts
it('should return an array', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', 'tobi.ferrets.example.com')
        .expect(200, ['ferrets', 'tobi'], done);
      }
```

#### should work with IPv4 address

```ts
it('should work with IPv4 address', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', '127.0.0.1')
        .expect(200, [], done);
      }
```

#### should work with IPv6 address

```ts
it('should work with IPv6 address', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', '[::1]')
        .expect(200, [], done);
      }
```

#### should return an empty array

```ts
it('should return an empty array', function(done){
        var app = express();

        app.use(function(req, res){
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect(200, [], done);
      }
```

#### should return an empty array

```ts
it('should return an empty array', function(done){
        var app = express();

        app.use(function(req, res){
          req.headers.host = null;
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .expect(200, [], done);
      }
```

#### should return an array

```ts
it('should return an array', function (done) {
        var app = express();

        app.set('trust proxy', true);
        app.use(function (req, res) {
          res.send(req.subdomains);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Host', 'tobi.ferrets.example.com')
        .expect(200, ['ferrets', 'tobi'], done);
      }
```

#### should return an array with the whole domain

```ts
it('should return an array with the whole domain', function(done){
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'tobi.ferrets.sub.example.com')
          .expect(200, ['com', 'example', 'sub', 'ferrets', 'tobi'], done);
        }
```

#### should return an array with the whole IPv4

```ts
it('should return an array with the whole IPv4', function (done) {
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', '127.0.0.1')
          .expect(200, ['127.0.0.1'], done);
        }
```

#### should return an array with the whole IPv6

```ts
it('should return an array with the whole IPv6', function (done) {
          var app = express();
          app.set('subdomain offset', 0);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', '[::1]')
          .expect(200, ['[::1]'], done);
        }
```

#### should return an array

```ts
it('should return an array', function(done){
          var app = express();
          app.set('subdomain offset', 3);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'tobi.ferrets.sub.example.com')
          .expect(200, ['ferrets', 'tobi'], done);
        }
```

#### should return an empty array

```ts
it('should return an empty array', function(done){
          var app = express();
          app.set('subdomain offset', 3);

          app.use(function(req, res){
            res.send(req.subdomains);
          });

          request(app)
          .get('/')
          .set('Host', 'sub.example.com')
          .expect(200, [], done);
        }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.protocol.js

#### should return the protocol string

```ts
it('should return the protocol string', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.protocol);
      });

      request(app)
      .get('/')
      .expect('http', done);
    }
```

#### should respect X-Forwarded-Proto

```ts
it('should respect X-Forwarded-Proto', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('https', done);
      }
```

#### should default to the socket addr if X-Forwarded-Proto not present

```ts
it('should default to the socket addr if X-Forwarded-Proto not present', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          req.socket.encrypted = true;
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .expect('https', done);
      }
```

#### should ignore X-Forwarded-Proto if socket addr not trusted

```ts
it('should ignore X-Forwarded-Proto if socket addr not trusted', function(done){
        var app = express();

        app.set('trust proxy', '10.0.0.1');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('http', done);
      }
```

#### should default to http

```ts
it('should default to http', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .expect('http', done);
      }
```

#### should respect X-Forwarded-Proto

```ts
it('should respect X-Forwarded-Proto', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.use(function (req, res) {
            res.end(req.protocol);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('https', done);
        }
```

#### should ignore X-Forwarded-Proto

```ts
it('should ignore X-Forwarded-Proto', function(done){
        var app = express();

        app.use(function(req, res){
          res.end(req.protocol);
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('http', done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.range.js

#### should return parsed ranges

```ts
it('should return parsed ranges', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-50,51-100')
      .expect(200, '[{"start":0,"end":50},{"start":51,"end":100}]', done)
    }
```

#### should cap to the given size

```ts
it('should cap to the given size', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '[{"start":0,"end":74}]', done)
    }
```

#### should cap to the given size when open-ended

```ts
it('should cap to the given size when open-ended', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(75))
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-')
      .expect(200, '[{"start":0,"end":74}]', done)
    }
```

#### should have a .type

```ts
it('should have a .type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'bytes=0-100')
      .expect(200, '"bytes"', done)
    }
```

#### should accept any type

```ts
it('should accept any type', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.json(req.range(120).type)
      })

      request(app)
      .get('/')
      .set('Range', 'users=0-2')
      .expect(200, '"users"', done)
    }
```

#### should return undefined if no range

```ts
it('should return undefined if no range', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.send(String(req.range(120)))
      })

      request(app)
      .get('/')
      .expect(200, 'undefined', done)
    }
```

#### should return combined ranges

```ts
it('should return combined ranges', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.json(req.range(120, {
            combine: true
          }))
        })

        request(app)
        .get('/')
        .set('Range', 'bytes=0-50,51-100')
        .expect(200, '[{"start":0,"end":100}]', done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.locals.js

#### should be empty by default

```ts
it('should be empty by default', function(done){
      var app = express();

      app.use(function(req, res){
        res.json(res.locals)
      });

      request(app)
      .get('/')
      .expect(200, {}, done)
    }
```

#### should work when mounted

```ts
it('should work when mounted', function(done){
    var app = express();
    var blog = express();

    app.use(blog);

    blog.use(function(req, res, next){
      res.locals.foo = 'bar';
      next();
    });

    app.use(function(req, res){
      res.json(res.locals)
    });

    request(app)
    .get('/')
    .expect(200, { foo: 'bar' }, done)
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.set.js

#### should set the response header field

```ts
it('should set the response header field', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/x-foo; charset=utf-8').end();
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/x-foo; charset=utf-8')
      .end(done);
    }
```

#### should coerce to a string

```ts
it('should coerce to a string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Number', 123);
        res.end(typeof res.get('X-Number'));
      });

      request(app)
      .get('/')
      .expect('X-Number', '123')
      .expect(200, 'string', done);
    }
```

#### should set multiple response header fields

```ts
it('should set multiple response header fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Set-Cookie', ["type=ninja", "language=javascript"]);
        res.send(res.get('Set-Cookie'));
      });

      request(app)
      .get('/')
      .expect('["type=ninja","language=javascript"]', done);
    }
```

#### should coerce to an array of strings

```ts
it('should coerce to an array of strings', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('X-Numbers', [123, 456]);
        res.end(JSON.stringify(res.get('X-Numbers')));
      });

      request(app)
      .get('/')
      .expect('X-Numbers', '123, 456')
      .expect(200, '["123","456"]', done);
    }
```

#### should not set a charset of one is already set

```ts
it('should not set a charset of one is already set', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set('Content-Type', 'text/html; charset=lol');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=lol')
      .expect(200, done);
    }
```

#### should throw when Content-Type is an array

```ts
it('should throw when Content-Type is an array', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.set('Content-Type', ['text/html'])
        res.end()
      });

      request(app)
      .get('/')
      .expect(500, /TypeError: Content-Type cannot be set to an Array/, done)
    }
```

#### should set multiple fields

```ts
it('should set multiple fields', function(done){
      var app = express();

      app.use(function(req, res){
        res.set({
          'X-Foo': 'bar',
          'X-Bar': 'baz'
        }).end();
      });

      request(app)
      .get('/')
      .expect('X-Foo', 'bar')
      .expect('X-Bar', 'baz')
      .end(done);
    }
```

#### should coerce to a string

```ts
it('should coerce to a string', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.set({ 'X-Number': 123 });
        res.end(typeof res.get('X-Number'));
      });

      request(app)
      .get('/')
      .expect('X-Number', '123')
      .expect(200, 'string', done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.redirect.js

#### should default to a 302 redirect

```ts
it('should default to a 302 redirect', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .expect('location', 'http://google.com')
      .expect(302, done)
    }
```

#### should encode "url"

```ts
it('should encode "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect('https://google.com?q=\u2603 §10')
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%E2%98%83%20%C2%A710')
      .expect(302, done)
    }
```

#### should not touch already-encoded sequences in "url"

```ts
it('should not touch already-encoded sequences in "url"', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.redirect('https://google.com?q=%A710')
      })

      request(app)
      .get('/')
      .expect('Location', 'https://google.com?q=%A710')
      .expect(302, done)
    }
```

#### should set the response status

```ts
it('should set the response status', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(303, 'http://google.com');
      });

      request(app)
      .get('/')
      .expect('Location', 'http://google.com')
      .expect(303, done)
    }
```

#### should ignore the body

```ts
it('should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
        .head('/')
        .expect(302)
        .expect('Location', 'http://google.com')
        .expect(utils.shouldNotHaveBody())
        .end(done)
    }
```

#### should respond with html

```ts
it('should respond with html', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(302, '<!DOCTYPE html><head><title>Found</title></head><body><p>Found. Redirecting to http://google.com</p></body>', done)
    }
```

#### should escape the url

```ts
it('should escape the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('<la\'me>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', '%3Cla\'me%3E')
      .expect(302, '<!DOCTYPE html><head><title>Found</title></head><body><p>Found. Redirecting to %3Cla&#39;me%3E</p></body>', done)
    }
```

#### should not render evil javascript links in anchor href (prevent XSS)

```ts
it('should not render evil javascript links in anchor href (prevent XSS)', function(done){
      var app = express();
      var xss = 'javascript:eval(document.body.innerHTML=`<p>XSS</p>`);';
      var encodedXss = 'javascript:eval(document.body.innerHTML=%60%3Cp%3EXSS%3C/p%3E%60);';

      app.use(function(req, res){
        res.redirect(xss);
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', encodedXss)
      .expect(302, '<!DOCTYPE html><head><title>Found</title></head><body><p>Found. Redirecting to ' + encodedXss +'</p></body>', done);
    }
```

#### should include the redirect type

```ts
it('should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect('Location', 'http://google.com')
      .expect(301, '<!DOCTYPE html><head><title>Moved Permanently</title></head><body><p>Moved Permanently. Redirecting to http://google.com</p></body>', done);
    }
```

#### should respond with text

```ts
it('should respond with text', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(302, 'Found. Redirecting to http://google.com', done)
    }
```

#### should encode the url

```ts
it('should encode the url', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://example.com/?param=<script>alert("hax");</script>');
      });

      request(app)
      .get('/')
      .set('Host', 'http://example.com')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E')
      .expect(302, 'Found. Redirecting to http://example.com/?param=%3Cscript%3Ealert(%22hax%22);%3C/script%3E', done)
    }
```

#### should include the redirect type

```ts
it('should include the redirect type', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect(301, 'http://google.com');
      });

      request(app)
      .get('/')
      .set('Accept', 'text/plain, */*')
      .expect('Content-Type', /plain/)
      .expect('Location', 'http://google.com')
      .expect(301, 'Moved Permanently. Redirecting to http://google.com', done);
    }
```

#### should respond with an empty body

```ts
it('should respond with an empty body', function(done){
      var app = express();

      app.use(function(req, res){
        res.redirect('http://google.com');
      });

      request(app)
        .get('/')
        .set('Accept', 'application/octet-stream')
        .expect(302)
        .expect('location', 'http://google.com')
        .expect('content-length', '0')
        .expect(utils.shouldNotHaveHeader('Content-Type'))
        .expect(utils.shouldNotHaveBody())
        .end(done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.secure.js

#### should return false when http

```ts
it('should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('no', done)
      }
```

#### should return false when http

```ts
it('should return false when http', function(done){
        var app = express();

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('no', done)
      }
```

#### should return true when "trust proxy" is enabled

```ts
it('should return true when "trust proxy" is enabled', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https')
        .expect('yes', done)
      }
```

#### should return false when initial proxy is http

```ts
it('should return false when initial proxy is http', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'http, https')
        .expect('no', done)
      }
```

#### should return true when initial proxy is https

```ts
it('should return true when initial proxy is https', function(done){
        var app = express();

        app.enable('trust proxy');

        app.get('/', function(req, res){
          res.send(req.secure ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('X-Forwarded-Proto', 'https, http')
        .expect('yes', done)
      }
```

#### should respect X-Forwarded-Proto

```ts
it('should respect X-Forwarded-Proto', function (done) {
          var app = express();

          app.set('trust proxy', 1);

          app.get('/', function (req, res) {
            res.send(req.secure ? 'yes' : 'no');
          });

          request(app)
          .get('/')
          .set('X-Forwarded-Proto', 'https')
          .expect('yes', done)
        }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/express.text.js

#### should 400 when invalid content-length

```ts
it('should 400 when invalid content-length', function (done) {
    var app = express()

    app.use(function (req, res, next) {
      req.headers['content-length'] = '20' // bad length
      next()
    })

    app.use(express.text())

    app.post('/', function (req, res) {
      res.json(req.body)
    })

    request(app)
      .post('/')
      .set('Content-Type', 'text/plain')
      .send('user')
      .expect(400, /content length/, done)
  }
```

#### should handle duplicated middleware

```ts
it('should handle duplicated middleware', function (done) {
    var app = express()

    app.use(express.text())
    app.use(express.text())

    app.post('/', function (req, res) {
      res.json(req.body)
    })

    request(app)
      .post('/')
      .set('Content-Type', 'text/plain')
      .send('user is tobi')
      .expect(200, '"user is tobi"', done)
  }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.attachment.js

#### should Content-Disposition to attachment

```ts
it('should Content-Disposition to attachment', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment().send('foo');
      });

      request(app)
      .get('/')
      .expect('Content-Disposition', 'attachment', done);
    }
```

#### should add the filename param

```ts
it('should add the filename param', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send('foo');
      });

      request(app)
      .get('/')
      .expect('Content-Disposition', 'attachment; filename="image.png"', done);
    }
```

#### should set the Content-Type

```ts
it('should set the Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/path/to/image.png');
        res.send(Buffer.alloc(4, '.'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'image/png', done);
    }
```

#### should add the filename and filename* params

```ts
it('should add the filename and filename* params', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/locales/日本語.txt');
        res.send('japanese');
      });

      request(app)
      .get('/')
      .expect('Content-Disposition', 'attachment; filename="???.txt"; filename*=UTF-8\'\'%E6%97%A5%E6%9C%AC%E8%AA%9E.txt')
      .expect(200, done);
    }
```

#### should set the Content-Type

```ts
it('should set the Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.attachment('/locales/日本語.txt');
        res.send('japanese');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8', done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.vary.js

#### should throw error

```ts
it('should throw error', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary();
        res.end();
      });

      request(app)
      .get('/')
      .expect(500, /field.*required/, done)
    }
```

#### should not set Vary

```ts
it('should not set Vary', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary([]);
        res.end();
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Vary'))
      .expect(200, done);
    }
```

#### should set the values

```ts
it('should set the values', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary(['Accept', 'Accept-Language', 'Accept-Encoding']);
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept, Accept-Language, Accept-Encoding')
      .expect(200, done);
    }
```

#### should set the value

```ts
it('should set the value', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary('Accept');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept')
      .expect(200, done);
    }
```

#### should not add it again

```ts
it('should not add it again', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary('Accept');
        res.vary('Accept-Encoding');
        res.vary('Accept-Encoding');
        res.vary('Accept-Encoding');
        res.vary('Accept');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept, Accept-Encoding')
      .expect(200, done);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.get.js

#### should return the header field value

```ts
it('should return the header field value', function(done){
      var app = express();

      app.use(function(req, res){
        assert(req.get('Something-Else') === undefined);
        res.end(req.get('Content-Type'));
      });

      request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('application/json', done);
    }
```

#### should special-case Referer

```ts
it('should special-case Referer', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.get('Referer'));
      });

      request(app)
      .post('/')
      .set('Referrer', 'http://foobar.com')
      .expect('http://foobar.com', done);
    }
```

#### should throw missing header name

```ts
it('should throw missing header name', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.end(req.get())
      })

      request(app)
      .get('/')
      .expect(500, /TypeError: name argument is required to req.get/, done)
    }
```

#### should throw for non-string header name

```ts
it('should throw for non-string header name', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.end(req.get(42))
      })

      request(app)
      .get('/')
      .expect(500, /TypeError: name must be a string to req.get/, done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.sendStatus.js

#### should send the status code and message as body

```ts
it('should send the status code and message as body', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(201);
      });

      request(app)
      .get('/')
      .expect(201, 'Created', done);
    }
```

#### should work with unknown code

```ts
it('should work with unknown code', function (done) {
      var app = express();

      app.use(function(req, res){
        res.sendStatus(599);
      });

      request(app)
      .get('/')
      .expect(599, '599', done);
    }
```

#### should raise error for invalid status code

```ts
it('should raise error for invalid status code', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.sendStatus(undefined).end()
      })

      request(app)
        .get('/')
        .expect(500, /TypeError: Invalid status code/, done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.download.js

#### should transfer as an attachment

```ts
it('should transfer as an attachment', function(done){
      var app = express();

      app.use(function(req, res){
        res.download('test/fixtures/user.html');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="user.html"')
      .expect(200, '<p>{{user.name}}</p>', done)
    }
```

#### should accept range requests

```ts
it('should accept range requests', function (done) {
      var app = express()

      app.get('/', function (req, res) {
        res.download('test/fixtures/user.html')
      })

      request(app)
        .get('/')
        .expect('Accept-Ranges', 'bytes')
        .expect(200, '<p>{{user.name}}</p>', done)
    }
```

#### should respond with requested byte range

```ts
it('should respond with requested byte range', function (done) {
      var app = express()

      app.get('/', function (req, res) {
        res.download('test/fixtures/user.html')
      })

      request(app)
        .get('/')
        .set('Range', 'bytes=0-2')
        .expect('Content-Range', 'bytes 0-2/20')
        .expect(206, '<p>', done)
    }
```

#### should provide an alternate filename

```ts
it('should provide an alternate filename', function(done){
      var app = express();

      app.use(function(req, res){
        res.download('test/fixtures/user.html', 'document');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="document"')
      .expect(200, done)
    }
```

#### should invoke the callback

```ts
it('should invoke the callback', function(done){
      var app = express();
      var cb = after(2, done);

      app.use(function(req, res){
        res.download('test/fixtures/user.html', cb);
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="user.html"')
      .expect(200, cb);
    }
```

#### should persist store

```ts
it('should persist store', function (done) {
        var app = express()
        var cb = after(2, done)
        var store = { foo: 'bar' }

        app.use(function (req, res, next) {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use(function (req, res) {
          res.download('test/fixtures/name.txt', function (err) {
            if (err) return cb(err)

            var local = req.asyncLocalStorage.getStore()

            assert.strictEqual(local.foo, 'bar')
            cb()
          })
        })

        request(app)
          .get('/')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect('Content-Disposition', 'attachment; filename="name.txt"')
          .expect(200, 'tobi', cb)
      }
```

#### should persist store on error

```ts
it('should persist store on error', function (done) {
        var app = express()
        var store = { foo: 'bar' }

        app.use(function (req, res, next) {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use(function (req, res) {
          res.download('test/fixtures/does-not-exist', function (err) {
            var local = req.asyncLocalStorage.getStore()

            if (local) {
              res.setHeader('x-store-foo', String(local.foo))
            }

            res.send(err ? 'got ' + err.status + ' error' : 'no error')
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('x-store-foo', 'bar')
          .expect('got 404 error')
          .end(done)
      }
```

#### should allow options to res.sendFile()

```ts
it('should allow options to res.sendFile()', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.download('test/fixtures/.name', {
          dotfiles: 'allow',
          maxAge: '4h'
        })
      })

      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment; filename=".name"')
        .expect('Cache-Control', 'public, max-age=14400')
        .expect(utils.shouldHaveBody(Buffer.from('tobi')))
        .end(done)
    }
```

#### should set headers on response

```ts
it('should set headers on response', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/user.html', {
            headers: {
              'X-Foo': 'Bar',
              'X-Bar': 'Foo'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'Bar')
          .expect('X-Bar', 'Foo')
          .end(done)
      }
```

#### should use last header when duplicated

```ts
it('should use last header when duplicated', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/user.html', {
            headers: {
              'X-Foo': 'Bar',
              'x-foo': 'bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'bar')
          .end(done)
      }
```

#### should override Content-Type

```ts
it('should override Content-Type', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/user.html', {
            headers: {
              'Content-Type': 'text/x-custom'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', 'text/x-custom')
          .end(done)
      }
```

#### should not set headers on 404

```ts
it('should not set headers on 404', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/does-not-exist', {
            headers: {
              'X-Foo': 'Bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(404)
          .expect(utils.shouldNotHaveHeader('X-Foo'))
          .end(done)
      }
```

#### should be ignored

```ts
it('should be ignored', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.download('test/fixtures/user.html', {
              headers: {
                'Content-Disposition': 'inline'
              }
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Content-Disposition', 'attachment; filename="user.html"')
            .end(done)
        }
```

#### should be ignored case-insensitively

```ts
it('should be ignored case-insensitively', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.download('test/fixtures/user.html', {
              headers: {
                'content-disposition': 'inline'
              }
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Content-Disposition', 'attachment; filename="user.html"')
            .end(done)
        }
```

#### should allow relative path

```ts
it('should allow relative path', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('name.txt', {
            root: FIXTURES_PATH
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Disposition', 'attachment; filename="name.txt"')
          .expect(utils.shouldHaveBody(Buffer.from('tobi')))
          .end(done)
      }
```

#### should allow up within root

```ts
it('should allow up within root', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('fake/../name.txt', {
            root: FIXTURES_PATH
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Disposition', 'attachment; filename="name.txt"')
          .expect(utils.shouldHaveBody(Buffer.from('tobi')))
          .end(done)
      }
```

#### should reject up outside root

```ts
it('should reject up outside root', function (done) {
        var app = express()

        app.use(function (req, res) {
          var p = '..' + path.sep +
            path.relative(path.dirname(FIXTURES_PATH), path.join(FIXTURES_PATH, 'name.txt'))

          res.download(p, {
            root: FIXTURES_PATH
          })
        })

        request(app)
          .get('/')
          .expect(403)
          .expect(utils.shouldNotHaveHeader('Content-Disposition'))
          .end(done)
      }
```

#### should reject reading outside root

```ts
it('should reject reading outside root', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('../name.txt', {
            root: FIXTURES_PATH
          })
        })

        request(app)
          .get('/')
          .expect(403)
          .expect(utils.shouldNotHaveHeader('Content-Disposition'))
          .end(done)
      }
```

#### should invoke the callback

```ts
it('should invoke the callback', function(done){
      var app = express();
      var cb = after(2, done);

      app.use(function(req, res){
        res.download('test/fixtures/user.html', 'document', cb)
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="document"')
      .expect(200, cb);
    }
```

#### should invoke the callback

```ts
it('should invoke the callback', function (done) {
      var app = express()
      var cb = after(2, done)
      var options = {}

      app.use(function (req, res) {
        res.download('test/fixtures/user.html', 'document', options, cb)
      })

      request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('Content-Disposition', 'attachment; filename="document"')
      .end(cb)
    }
```

#### should allow options to res.sendFile()

```ts
it('should allow options to res.sendFile()', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.download('test/fixtures/.name', 'document', {
          dotfiles: 'allow',
          maxAge: '4h'
        })
      })

      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Disposition', 'attachment; filename="document"')
        .expect('Cache-Control', 'public, max-age=14400')
        .expect(utils.shouldHaveBody(Buffer.from('tobi')))
        .end(done)
    }
```

#### should be ignored

```ts
it('should be ignored', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/user.html', 'document', {
            headers: {
              'Content-Type': 'text/x-custom',
              'Content-Disposition': 'inline'
            }
          })
        })

        request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/x-custom')
        .expect('Content-Disposition', 'attachment; filename="document"')
        .end(done)
      }
```

#### should be ignored case-insensitively

```ts
it('should be ignored case-insensitively', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.download('test/fixtures/user.html', 'document', {
            headers: {
              'content-type': 'text/x-custom',
              'content-disposition': 'inline'
            }
          })
        })

        request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/x-custom')
        .expect('Content-Disposition', 'attachment; filename="document"')
        .end(done)
      }
```

#### should remove Content-Disposition

```ts
it('should remove Content-Disposition', function(done){
      var app = express()

      app.use(function (req, res, next) {
        res.download('test/fixtures/foobar.html', function(err){
          if (!err) return next(new Error('expected error'));
          res.end('failed');
        });
      });

      request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('Content-Disposition'))
        .expect(200, 'failed', done)
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.route.js

#### should return a new route

```ts
it('should return a new route', function(done){
    var app = express();

    app.route('/foo')
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  }
```

#### should all .VERB after .all

```ts
it('should all .VERB after .all', function(done){
    var app = express();

    app.route('/foo')
    .all(function(req, res, next) {
      next();
    })
    .get(function(req, res) {
      res.send('get');
    })
    .post(function(req, res) {
      res.send('post');
    });

    request(app)
    .post('/foo')
    .expect('post', done);
  }
```

#### should support dynamic routes

```ts
it('should support dynamic routes', function(done){
    var app = express();

    app.route('/:foo')
    .get(function(req, res) {
      res.send(req.params.foo);
    });

    request(app)
    .get('/test')
    .expect('test', done);
  }
```

#### should not error on empty routes

```ts
it('should not error on empty routes', function(done){
    var app = express();

    app.route('/:foo');

    request(app)
    .get('/test')
    .expect(404, done);
  }
```

#### should pass rejected promise value

```ts
it('should pass rejected promise value', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        return Promise.reject(new Error('boom!'))
      })

      route.all(function helloWorld (req, res) {
        res.send('hello, world!')
      })

      route.all(function handleError (err, req, res, next) {
        res.status(500)
        res.send('caught: ' + err.message)
      })

      request(app)
      .get('/foo')
      .expect(500, 'caught: boom!', done)
    }
```

#### should pass rejected promise without value

```ts
it('should pass rejected promise without value', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        return Promise.reject()
      })

      route.all(function helloWorld (req, res) {
        res.send('hello, world!')
      })

      route.all(function handleError (err, req, res, next) {
        res.status(500)
        res.send('caught: ' + err.message)
      })

      request(app)
      .get('/foo')
      .expect(500, 'caught: Rejected promise', done)
    }
```

#### should ignore resolved promise

```ts
it('should ignore resolved promise', function (done) {
      var app = express()
      var route = app.route('/foo')

      route.all(function createError (req, res, next) {
        res.send('saw GET /foo')
        return Promise.resolve('foo')
      })

      route.all(function () {
        done(new Error('Unexpected route invoke'))
      })

      request(app)
      .get('/foo')
      .expect(200, 'saw GET /foo', done)
    }
```

#### should pass rejected promise value

```ts
it('should pass rejected promise value', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          return Promise.reject(new Error('caught: ' + err.message))
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught again: ' + err.message)
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught again: caught: boom!', done)
      }
```

#### should pass rejected promise without value

```ts
it('should pass rejected promise without value', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          return Promise.reject()
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught again: ' + err.message)
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught again: Rejected promise', done)
      }
```

#### should ignore resolved promise

```ts
it('should ignore resolved promise', function (done) {
        var app = express()
        var route = app.route('/foo')

        route.all(function createError (req, res, next) {
          return Promise.reject(new Error('boom!'))
        })

        route.all(function handleError (err, req, res, next) {
          res.status(500)
          res.send('caught: ' + err.message)
          return Promise.resolve('foo')
        })

        route.all(function () {
          done(new Error('Unexpected route invoke'))
        })

        request(app)
        .get('/foo')
        .expect(500, 'caught: boom!', done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.acceptsCharsets.js

#### should return true

```ts
it('should return true', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .expect('yes', done);
      }
```

#### should return true

```ts
it('should return true', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar, utf-8')
        .expect('yes', done);
      }
```

#### should return false otherwise

```ts
it('should return false otherwise', function(done){
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8') ? 'yes' : 'no');
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'foo, bar')
        .expect('no', done);
      }
```

#### should return the best matching charset from multiple inputs

```ts
it('should return the best matching charset from multiple inputs', function (done) {
        var app = express();

        app.use(function(req, res, next){
          res.end(req.acceptsCharsets('utf-8', 'iso-8859-1'));
        });

        request(app)
        .get('/')
        .set('Accept-Charset', 'iso-8859-1, utf-8')
        .expect('iso-8859-1', done);
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.sendFile.js

#### should not override manual content-types

```ts
it('should not override manual content-types', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.contentType('application/x-bogus');
        res.sendFile(path.resolve(fixtures, 'name.txt'));
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/x-bogus')
      .end(done);
    }
```

#### should not error if the client aborts

```ts
it('should not error if the client aborts', function (done) {
      var app = express();
      var cb = after(2, done)
      var error = null

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'));
          setTimeout(function () {
            cb(error)
          }, 10)
        })
        test.req.abort()
      });

      app.use(function (err, req, res, next) {
        error = err
        next(err)
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.end(function (err) {
        assert.ok(err)
        server.close(cb)
      })
    }
```

#### should invoke the callback when client aborts

```ts
it('should invoke the callback when client aborts', function (done) {
      var cb = after(2, done)
      var app = express();

      app.use(function (req, res) {
        setImmediate(function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            assert.ok(err)
            assert.strictEqual(err.code, 'ECONNABORTED')
            cb()
          });
        });
        test.req.abort()
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.end(function (err) {
        assert.ok(err)
        server.close(cb)
      })
    }
```

#### should invoke the callback when client already aborted

```ts
it('should invoke the callback when client already aborted', function (done) {
      var cb = after(2, done)
      var app = express();

      app.use(function (req, res) {
        onFinished(res, function () {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            assert.ok(err)
            assert.strictEqual(err.code, 'ECONNABORTED')
            cb()
          });
        });
        test.req.abort()
      });

      var server = app.listen()
      var test = request(server).get('/')
      test.end(function (err) {
        assert.ok(err)
        server.close(cb)
      })
    }
```

#### should invoke the callback without error when HEAD

```ts
it('should invoke the callback without error when HEAD', function (done) {
      var app = express();
      var cb = after(2, done);

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'name.txt'), cb);
      });

      request(app)
      .head('/')
      .expect(200, cb);
    }
```

#### should invoke the callback on 404

```ts
it('should invoke the callback on 404', function(done){
      var app = express();

      app.use(function (req, res) {
        res.sendFile(path.resolve(fixtures, 'does-not-exist'), function (err) {
          res.send(err ? 'got ' + err.status + ' error' : 'no error')
        });
      });

      request(app)
        .get('/')
        .expect(200, 'got 404 error', done)
    }
```

#### should persist store

```ts
it('should persist store', function (done) {
        var app = express()
        var cb = after(2, done)
        var store = { foo: 'bar' }

        app.use(function (req, res, next) {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'name.txt'), function (err) {
            if (err) return cb(err)

            var local = req.asyncLocalStorage.getStore()

            assert.strictEqual(local.foo, 'bar')
            cb()
          })
        })

        request(app)
          .get('/')
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .expect(200, 'tobi', cb)
      }
```

#### should persist store on error

```ts
it('should persist store on error', function (done) {
        var app = express()
        var store = { foo: 'bar' }

        app.use(function (req, res, next) {
          req.asyncLocalStorage = new AsyncLocalStorage()
          req.asyncLocalStorage.run(store, next)
        })

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'does-not-exist'), function (err) {
            var local = req.asyncLocalStorage.getStore()

            if (local) {
              res.setHeader('x-store-foo', String(local.foo))
            }

            res.send(err ? 'got ' + err.status + ' error' : 'no error')
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('x-store-foo', 'bar')
          .expect('got 404 error')
          .end(done)
      }
```

#### should advertise byte range accepted

```ts
it('should advertise byte range accepted', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Accept-Ranges', 'bytes')
            .expect('123456789')
            .end(done)
        }
```

#### should respond to range request

```ts
it('should respond to range request', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: true
            })
          })

          request(app)
            .get('/')
            .set('Range', 'bytes=0-4')
            .expect(206, '12345', done)
        }
```

#### should not advertise accept-ranges

```ts
it('should not advertise accept-ranges', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Accept-Ranges'))
            .end(done)
        }
```

#### should not honor range requests

```ts
it('should not honor range requests', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'nums.txt'), {
              acceptRanges: false
            })
          })

          request(app)
            .get('/')
            .set('Range', 'bytes=0-4')
            .expect(200, '123456789', done)
        }
```

#### should send cache-control header

```ts
it('should send cache-control header', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0')
            .end(done)
        }
```

#### should not send cache-control header

```ts
it('should not send cache-control header', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Cache-Control'))
            .end(done)
        }
```

#### should allow dotfiles

```ts
it('should allow dotfiles', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'allow'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldHaveBody(Buffer.from('tobi')))
            .end(done)
        }
```

#### should deny dotfiles

```ts
it('should deny dotfiles', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'deny'
            })
          })

          request(app)
            .get('/')
            .expect(403)
            .expect(/Forbidden/)
            .end(done)
        }
```

#### should ignore dotfiles

```ts
it('should ignore dotfiles', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, '.name'), {
              dotfiles: 'ignore'
            })
          })

          request(app)
            .get('/')
            .expect(404)
            .expect(/Not Found/)
            .end(done)
        }
```

#### should set headers on response

```ts
it('should set headers on response', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'X-Foo': 'Bar',
              'X-Bar': 'Foo'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'Bar')
          .expect('X-Bar', 'Foo')
          .end(done)
      }
```

#### should use last header when duplicated

```ts
it('should use last header when duplicated', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'X-Foo': 'Bar',
              'x-foo': 'bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('X-Foo', 'bar')
          .end(done)
      }
```

#### should override Content-Type

```ts
it('should override Content-Type', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            headers: {
              'Content-Type': 'text/x-custom'
            }
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Content-Type', 'text/x-custom')
          .end(done)
      }
```

#### should not set headers on 404

```ts
it('should not set headers on 404', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'does-not-exist'), {
            headers: {
              'X-Foo': 'Bar'
            }
          })
        })

        request(app)
          .get('/')
          .expect(404)
          .expect(utils.shouldNotHaveHeader('X-Foo'))
          .end(done)
      }
```

#### should send cache-control header with immutable

```ts
it('should send cache-control header with immutable', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              immutable: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0, immutable')
            .end(done)
        }
```

#### should not send cache-control header with immutable

```ts
it('should not send cache-control header with immutable', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              immutable: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=0')
            .end(done)
        }
```

#### should send last-modified header

```ts
it('should send last-modified header', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: true
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldHaveHeader('Last-Modified'))
            .end(done)
        }
```

#### should conditionally respond with if-modified-since

```ts
it('should conditionally respond with if-modified-since', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: true
            })
          })

          request(app)
            .get('/')
            .set('If-Modified-Since', (new Date(Date.now() + 99999).toUTCString()))
            .expect(304, done)
        }
```

#### should not have last-modified header

```ts
it('should not have last-modified header', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: false
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Last-Modified'))
            .end(done)
        }
```

#### should not honor if-modified-since

```ts
it('should not honor if-modified-since', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              lastModified: false
            })
          })

          request(app)
            .get('/')
            .set('If-Modified-Since', (new Date(Date.now() + 99999).toUTCString()))
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Last-Modified'))
            .end(done)
        }
```

#### should set cache-control max-age to milliseconds

```ts
it('should set cache-control max-age to milliseconds', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 20000
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=20')
          .end(done)
      }
```

#### should cap cache-control max-age to 1 year

```ts
it('should cap cache-control max-age to 1 year', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 99999999999
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=31536000')
          .end(done)
      }
```

#### should min cache-control max-age to 0

```ts
it('should min cache-control max-age to 0', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: -20000
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=0')
          .end(done)
      }
```

#### should floor cache-control max-age

```ts
it('should floor cache-control max-age', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile(path.resolve(fixtures, 'user.html'), {
            maxAge: 21911.23
          })
        })

        request(app)
          .get('/')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=21')
          .end(done)
      }
```

#### should not send cache-control

```ts
it('should not send cache-control', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              cacheControl: false,
              maxAge: 20000
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect(utils.shouldNotHaveHeader('Cache-Control'))
            .end(done)
        }
```

#### should accept plain number as milliseconds

```ts
it('should accept plain number as milliseconds', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20000'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=20')
            .end(done)
        }
```

#### should accept suffix "s" for seconds

```ts
it('should accept suffix "s" for seconds', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20s'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=20')
            .end(done)
        }
```

#### should accept suffix "m" for minutes

```ts
it('should accept suffix "m" for minutes', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20m'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=1200')
            .end(done)
        }
```

#### should accept suffix "d" for days

```ts
it('should accept suffix "d" for days', function (done) {
          var app = express()

          app.use(function (req, res) {
            res.sendFile(path.resolve(fixtures, 'user.html'), {
              maxAge: '20d'
            })
          })

          request(app)
            .get('/')
            .expect(200)
            .expect('Cache-Control', 'public, max-age=1728000')
            .end(done)
        }
```

#### should allow relative path

```ts
it('should allow relative path', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile('name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(200, 'tobi', done)
      }
```

#### should allow up within root

```ts
it('should allow up within root', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile('fake/../name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(200, 'tobi', done)
      }
```

#### should reject up outside root

```ts
it('should reject up outside root', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile('..' + path.sep + path.relative(path.dirname(fixtures), path.join(fixtures, 'name.txt')), {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(403, done)
      }
```

#### should reject reading outside root

```ts
it('should reject reading outside root', function (done) {
        var app = express()

        app.use(function (req, res) {
          res.sendFile('../name.txt', {
            root: fixtures
          })
        })

        request(app)
          .get('/')
          .expect(403, done)
      }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.ip.js

#### should return the client addr

```ts
it('should return the client addr', function(done){
          var app = express();

          app.enable('trust proxy');

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('client', done);
        }
```

#### should return the addr after trusted proxy based on count

```ts
it('should return the addr after trusted proxy based on count', function (done) {
          var app = express();

          app.set('trust proxy', 2);

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect('p1', done);
        }
```

#### should return the addr after trusted proxy based on list

```ts
it('should return the addr after trusted proxy based on list', function (done) {
          var app = express()

          app.set('trust proxy', '10.0.0.1, 10.0.0.2, 127.0.0.1, ::1')

          app.get('/', function (req, res) {
            res.send(req.ip)
          })

          request(app)
            .get('/')
            .set('X-Forwarded-For', '10.0.0.2, 10.0.0.3, 10.0.0.1', '10.0.0.4')
            .expect('10.0.0.3', done)
        }
```

#### should return the addr after trusted proxy, from sub app

```ts
it('should return the addr after trusted proxy, from sub app', function (done) {
          var app = express();
          var sub = express();

          app.set('trust proxy', 2);
          app.use(sub);

          sub.use(function (req, res, next) {
            res.send(req.ip);
          });

          request(app)
          .get('/')
          .set('X-Forwarded-For', 'client, p1, p2')
          .expect(200, 'p1', done);
        }
```

#### should return the remote address

```ts
it('should return the remote address', function(done){
          var app = express();

          app.use(function(req, res, next){
            res.send(req.ip);
          });

          var test = request(app).get('/')
          test.set('X-Forwarded-For', 'client, p1, p2')
          test.expect(200, getExpectedClientAddress(test._server), done);
        }
```

#### should return the remote address

```ts
it('should return the remote address', function(done){
        var app = express();

        app.enable('trust proxy');

        app.use(function(req, res, next){
          res.send(req.ip);
        });

        var test = request(app).get('/')
        test.expect(200, getExpectedClientAddress(test._server), done)
      }
```

## path

**Consultas usadas no Horsebox:** `join`, `path join`

**Arquivos de teste encontrados:** 167

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-haste-map/src/lib/__tests__/fast_path.test.js

#### should get relative paths inside the root

```ts
it('should get relative paths inside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'bar', 'baz', 'foobar');
    const relativeFilename = path.join('baz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get relative paths outside the root

```ts
it('should get relative paths outside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'baz', 'foobar');
    const relativeFilename = path.join('..', 'baz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get relative paths outside the root when start with same word

```ts
it('should get relative paths outside the root when start with same word', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const filename = path.join(__dirname, 'foo', 'barbaz', 'foobar');
    const relativeFilename = path.join('..', 'barbaz', 'foobar');
    expect(relative(root, filename)).toBe(relativeFilename);
  }
```

#### should get the absolute path for paths inside the root

```ts
it('should get the absolute path for paths inside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const relativeFilename = path.join('baz', 'foobar');
    const filename = path.join(__dirname, 'foo', 'bar', 'baz', 'foobar');
    expect(resolve(root, relativeFilename)).toBe(filename);
  }
```

#### should get the absolute path for paths outside the root

```ts
it('should get the absolute path for paths outside the root', () => {
    const root = path.join(__dirname, 'foo', 'bar');
    const relativeFilename = path.join('..', 'baz', 'foobar');
    const filename = path.join(__dirname, 'foo', 'baz', 'foobar');
    expect(resolve(root, relativeFilename)).toBe(filename);
  }
```

### ../../../../../.ctest/repos/95324de690-parser/packages/babel-code-frame/test/index.js

#### basic usage

```ts
test("basic usage", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, 16)).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### optional column number

```ts
test("optional column number", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, null)).toEqual(
      ["  1 | class Foo {", "> 2 |   constructor()", "  3 | };"].join("\n"),
    );
  }
```

#### maximum context lines and padding

```ts
test("maximum context lines and padding", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2)).toEqual(
      [
        "   5 |  * @param b Number",
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### no unnecessary padding due to one-off errors

```ts
test("no unnecessary padding due to one-off errors", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 6, 2)).toEqual(
      [
        "  4 |  * @param a Number",
        "  5 |  * @param b Number",
        "> 6 |  * @returns Number",
        "    |  ^",
        "  7 |  */",
        "  8 |",
        "  9 | function sum(a, b) {",
      ].join("\n"),
    );
  }
```

#### tabs

```ts
test("tabs", function () {
    const rawLines = [
      "\tclass Foo {",
      "\t  \t\t    constructor\t(\t)",
      "\t};",
    ].join("\n");
    expect(codeFrame(rawLines, 2, 25)).toEqual(
      [
        "  1 | \tclass Foo {",
        "> 2 | \t  \t\t    constructor\t(\t)",
        "    | \t  \t\t               \t \t ^",
        "  3 | \t};",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove

```ts
test("opts.linesAbove", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1 })).toEqual(
      [
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow

```ts
test("opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesBelow: 1 })).toEqual(
      [
        "  5 |  * @param b Number",
        "  6 |  * @returns Number",
        "> 7 |  */",
        "    |  ^",
        "  8 |",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove and opts.linesBelow

```ts
test("opts.linesAbove and opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1, linesBelow: 1 })).toEqual(
      ["  6 |  * @returns Number", "> 7 |  */", "    |  ^", "  8 |"].join("\n"),
    );
  }
```

#### opts.linesAbove no lines above

```ts
test("opts.linesAbove no lines above", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesAbove: 0 }),
    ).toEqual(
      [
        "> 2 |   constructor() {",
        "  3 |     console.log(arguments);",
        "  4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow no lines below

```ts
test("opts.linesBelow no lines below", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesBelow: 0 }),
    ).toEqual(["  1 | class Foo {", "> 2 |   constructor() {"].join("\n"));
  }
```

#### opts.linesBelow single line

```ts
test("opts.linesBelow single line", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        { linesAbove: 0, linesBelow: 0 },
      ),
    ).toEqual(["> 2 |   constructor() {"].join("\n"));
  }
```

#### basic usage, new API

```ts
test("basic usage, new API", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2, column: 16 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns

```ts
test("mark multiple columns", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 3 },
        end: { line: 2, column: 16 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |   ^^^^^^^^^^^^^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across lines

```ts
test("mark multiple columns across lines", function () {
    const rawLines = ["class Foo {", "  constructor() {", "  }", "};"].join(
      "\n",
    );
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 3, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |   }",
        "    | ^^^",
        "  4 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across multiple lines

```ts
test("mark multiple columns across multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 4, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### mark across multiple lines without columns

```ts
test("mark across multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 }, end: { line: 4 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message

```ts
test("opts.message", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2, column: 16 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^ Missing {",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message without column

```ts
test("opts.message without column", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  Missing {",
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines

```ts
test("opts.message with multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        {
          start: { line: 2, column: 17 },
          end: { line: 4, column: 3 },
        },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^ something about the constructor body",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines without columns

```ts
test("opts.message with multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 }, end: { line: 4 } },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  something about the constructor body",
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

### ../../../../../.ctest/repos/cc6b13a61c-@babel_parser/packages/babel-code-frame/test/index.js

#### basic usage

```ts
test("basic usage", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, 16)).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### optional column number

```ts
test("optional column number", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, null)).toEqual(
      ["  1 | class Foo {", "> 2 |   constructor()", "  3 | };"].join("\n"),
    );
  }
```

#### maximum context lines and padding

```ts
test("maximum context lines and padding", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2)).toEqual(
      [
        "   5 |  * @param b Number",
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### no unnecessary padding due to one-off errors

```ts
test("no unnecessary padding due to one-off errors", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 6, 2)).toEqual(
      [
        "  4 |  * @param a Number",
        "  5 |  * @param b Number",
        "> 6 |  * @returns Number",
        "    |  ^",
        "  7 |  */",
        "  8 |",
        "  9 | function sum(a, b) {",
      ].join("\n"),
    );
  }
```

#### tabs

```ts
test("tabs", function () {
    const rawLines = [
      "\tclass Foo {",
      "\t  \t\t    constructor\t(\t)",
      "\t};",
    ].join("\n");
    expect(codeFrame(rawLines, 2, 25)).toEqual(
      [
        "  1 | \tclass Foo {",
        "> 2 | \t  \t\t    constructor\t(\t)",
        "    | \t  \t\t               \t \t ^",
        "  3 | \t};",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove

```ts
test("opts.linesAbove", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1 })).toEqual(
      [
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow

```ts
test("opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesBelow: 1 })).toEqual(
      [
        "  5 |  * @param b Number",
        "  6 |  * @returns Number",
        "> 7 |  */",
        "    |  ^",
        "  8 |",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove and opts.linesBelow

```ts
test("opts.linesAbove and opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1, linesBelow: 1 })).toEqual(
      ["  6 |  * @returns Number", "> 7 |  */", "    |  ^", "  8 |"].join("\n"),
    );
  }
```

#### opts.linesAbove no lines above

```ts
test("opts.linesAbove no lines above", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesAbove: 0 }),
    ).toEqual(
      [
        "> 2 |   constructor() {",
        "  3 |     console.log(arguments);",
        "  4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow no lines below

```ts
test("opts.linesBelow no lines below", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesBelow: 0 }),
    ).toEqual(["  1 | class Foo {", "> 2 |   constructor() {"].join("\n"));
  }
```

#### opts.linesBelow single line

```ts
test("opts.linesBelow single line", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        { linesAbove: 0, linesBelow: 0 },
      ),
    ).toEqual(["> 2 |   constructor() {"].join("\n"));
  }
```

#### basic usage, new API

```ts
test("basic usage, new API", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2, column: 16 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns

```ts
test("mark multiple columns", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 3 },
        end: { line: 2, column: 16 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |   ^^^^^^^^^^^^^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across lines

```ts
test("mark multiple columns across lines", function () {
    const rawLines = ["class Foo {", "  constructor() {", "  }", "};"].join(
      "\n",
    );
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 3, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |   }",
        "    | ^^^",
        "  4 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across multiple lines

```ts
test("mark multiple columns across multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 4, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### mark across multiple lines without columns

```ts
test("mark across multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 }, end: { line: 4 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message

```ts
test("opts.message", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2, column: 16 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^ Missing {",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message without column

```ts
test("opts.message without column", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  Missing {",
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines

```ts
test("opts.message with multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        {
          start: { line: 2, column: 17 },
          end: { line: 4, column: 3 },
        },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^ something about the constructor body",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines without columns

```ts
test("opts.message with multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 }, end: { line: 4 } },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  something about the constructor body",
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

### ../../../../../.ctest/repos/e7b1fff700-types/packages/babel-code-frame/test/index.js

#### basic usage

```ts
test("basic usage", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, 16)).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### optional column number

```ts
test("optional column number", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(codeFrame(rawLines, 2, null)).toEqual(
      ["  1 | class Foo {", "> 2 |   constructor()", "  3 | };"].join("\n"),
    );
  }
```

#### maximum context lines and padding

```ts
test("maximum context lines and padding", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2)).toEqual(
      [
        "   5 |  * @param b Number",
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### no unnecessary padding due to one-off errors

```ts
test("no unnecessary padding due to one-off errors", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 6, 2)).toEqual(
      [
        "  4 |  * @param a Number",
        "  5 |  * @param b Number",
        "> 6 |  * @returns Number",
        "    |  ^",
        "  7 |  */",
        "  8 |",
        "  9 | function sum(a, b) {",
      ].join("\n"),
    );
  }
```

#### tabs

```ts
test("tabs", function () {
    const rawLines = [
      "\tclass Foo {",
      "\t  \t\t    constructor\t(\t)",
      "\t};",
    ].join("\n");
    expect(codeFrame(rawLines, 2, 25)).toEqual(
      [
        "  1 | \tclass Foo {",
        "> 2 | \t  \t\t    constructor\t(\t)",
        "    | \t  \t\t               \t \t ^",
        "  3 | \t};",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove

```ts
test("opts.linesAbove", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1 })).toEqual(
      [
        "   6 |  * @returns Number",
        ">  7 |  */",
        "     |  ^",
        "   8 |",
        "   9 | function sum(a, b) {",
        "  10 |   return a + b",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow

```ts
test("opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesBelow: 1 })).toEqual(
      [
        "  5 |  * @param b Number",
        "  6 |  * @returns Number",
        "> 7 |  */",
        "    |  ^",
        "  8 |",
      ].join("\n"),
    );
  }
```

#### opts.linesAbove and opts.linesBelow

```ts
test("opts.linesAbove and opts.linesBelow", function () {
    const rawLines = [
      "/**",
      " * Sums two numbers.",
      " *",
      " * @param a Number",
      " * @param b Number",
      " * @returns Number",
      " */",
      "",
      "function sum(a, b) {",
      "  return a + b",
      "}",
    ].join("\n");
    expect(codeFrame(rawLines, 7, 2, { linesAbove: 1, linesBelow: 1 })).toEqual(
      ["  6 |  * @returns Number", "> 7 |  */", "    |  ^", "  8 |"].join("\n"),
    );
  }
```

#### opts.linesAbove no lines above

```ts
test("opts.linesAbove no lines above", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesAbove: 0 }),
    ).toEqual(
      [
        "> 2 |   constructor() {",
        "  3 |     console.log(arguments);",
        "  4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.linesBelow no lines below

```ts
test("opts.linesBelow no lines below", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 } }, { linesBelow: 0 }),
    ).toEqual(["  1 | class Foo {", "> 2 |   constructor() {"].join("\n"));
  }
```

#### opts.linesBelow single line

```ts
test("opts.linesBelow single line", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        { linesAbove: 0, linesBelow: 0 },
      ),
    ).toEqual(["> 2 |   constructor() {"].join("\n"));
  }
```

#### basic usage, new API

```ts
test("basic usage, new API", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2, column: 16 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns

```ts
test("mark multiple columns", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 3 },
        end: { line: 2, column: 16 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |   ^^^^^^^^^^^^^",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across lines

```ts
test("mark multiple columns across lines", function () {
    const rawLines = ["class Foo {", "  constructor() {", "  }", "};"].join(
      "\n",
    );
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 3, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |   }",
        "    | ^^^",
        "  4 | };",
      ].join("\n"),
    );
  }
```

#### mark multiple columns across multiple lines

```ts
test("mark multiple columns across multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, {
        start: { line: 2, column: 17 },
        end: { line: 4, column: 3 },
      }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### mark across multiple lines without columns

```ts
test("mark across multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(rawLines, { start: { line: 2 }, end: { line: 4 } }),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message

```ts
test("opts.message", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2, column: 16 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "    |                ^ Missing {",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message without column

```ts
test("opts.message without column", function () {
    const rawLines = ["class Foo {", "  constructor()", "};"].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 } },
        {
          message: "Missing {",
        },
      ),
    ).toEqual(
      [
        "  Missing {",
        "  1 | class Foo {",
        "> 2 |   constructor()",
        "  3 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines

```ts
test("opts.message with multiple lines", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        {
          start: { line: 2, column: 17 },
          end: { line: 4, column: 3 },
        },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "    |                 ^",
        "> 3 |     console.log(arguments);",
        "    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^",
        "> 4 |   }",
        "    | ^^^ something about the constructor body",
        "  5 | };",
      ].join("\n"),
    );
  }
```

#### opts.message with multiple lines without columns

```ts
test("opts.message with multiple lines without columns", function () {
    const rawLines = [
      "class Foo {",
      "  constructor() {",
      "    console.log(arguments);",
      "  }",
      "};",
    ].join("\n");
    expect(
      codeFrameColumns(
        rawLines,
        { start: { line: 2 }, end: { line: 4 } },
        {
          message: "something about the constructor body",
        },
      ),
    ).toEqual(
      [
        "  something about the constructor body",
        "  1 | class Foo {",
        "> 2 |   constructor() {",
        "> 3 |     console.log(arguments);",
        "> 4 |   }",
        "  5 | };",
      ].join("\n"),
    );
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/index.test.js

#### creates valid cache file paths

```ts
it('creates valid cache file paths', () => {
    jest.resetModules();
    HasteMap = require('../').default;

    expect(
      HasteMap.getCacheFilePath('/', '@scoped/package', 'random-value'),
    ).toMatch(
      process.platform === 'win32'
        ? /^\\-scoped-package-(.*)$/
        : /^\/-scoped-package-(.*)$/,
    );
  }
```

#### creates different cache file paths for different roots

```ts
it('creates different cache file paths for different roots', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      rootDir: '/root1',
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      rootDir: '/root2',
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different dependency extractor cache keys

```ts
it('creates different cache file paths for different dependency extractor cache keys', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const dependencyExtractor = require('./dependencyExtractor');
    const config = {
      ...defaultConfig,
      dependencyExtractor: require.resolve('./dependencyExtractor'),
    };
    dependencyExtractor.setCacheKey('foo');
    const hasteMap1 = await HasteMap.create(config);
    dependencyExtractor.setCacheKey('bar');
    const hasteMap2 = await HasteMap.create(config);
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different values of computeDependencies

```ts
it('creates different cache file paths for different values of computeDependencies', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      computeDependencies: true,
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      computeDependencies: false,
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different hasteImplModulePath cache keys

```ts
it('creates different cache file paths for different hasteImplModulePath cache keys', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteImpl = require('./haste_impl');
    hasteImpl.setCacheKey('foo');
    const hasteMap1 = await HasteMap.create(defaultConfig);
    hasteImpl.setCacheKey('bar');
    const hasteMap2 = await HasteMap.create(defaultConfig);
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### creates different cache file paths for different projects

```ts
it('creates different cache file paths for different projects', async () => {
    jest.resetModules();
    const HasteMap = require('../').default;
    const hasteMap1 = await HasteMap.create({
      ...defaultConfig,
      id: '@scoped/package',
    });
    const hasteMap2 = await HasteMap.create({
      ...defaultConfig,
      id: '-scoped-package',
    });
    expect(hasteMap1.getCacheFilePath()).not.toBe(hasteMap2.getCacheFilePath());
  }
```

#### matches files against a pattern

```ts
it('matches files against a pattern', async () => {
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(
      hasteFS.matchFiles(
        process.platform === 'win32' ? /project\\fruits/ : /project\/fruits/,
      ),
    ).toEqual([
      path.join('/', 'project', 'fruits', 'Banana.js'),
      path.join('/', 'project', 'fruits', 'Pear.js'),
      path.join('/', 'project', 'fruits', 'Strawberry.js'),
      path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
    ]);

    expect(hasteFS.matchFiles(/__mocks__/)).toEqual([
      path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
    ]);
  }
```

#### ignores files given a pattern

```ts
it('ignores files given a pattern', async () => {
    const config = {...defaultConfig, ignorePattern: /Kiwi/};
    mockFs[path.join('/', 'project', 'fruits', 'Kiwi.js')] = `
      // Kiwi!
    `;
    const {hasteFS} = await (await HasteMap.create(config)).build();
    expect(hasteFS.matchFiles(/Kiwi/)).toEqual([]);
  }
```

#### ignores vcs directories without ignore pattern

```ts
it('ignores vcs directories without ignore pattern', async () => {
    mockFs[path.join('/', 'project', 'fruits', '.git', 'fruit-history.js')] = `
      // test
    `;
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(hasteFS.matchFiles('.git')).toEqual([]);
  }
```

#### ignores sapling vcs directories without ignore pattern

```ts
it('ignores sapling vcs directories without ignore pattern', async () => {
    mockFs[path.join('/', 'project', 'fruits', '.sl', 'package.json')] = `
      invalid}{
    `;
    const {hasteFS} = await (await HasteMap.create(defaultConfig)).build();
    expect(hasteFS.matchFiles('.sl')).toEqual([]);
  }
```

#### ignores vcs directories with ignore pattern regex

```ts
it('ignores vcs directories with ignore pattern regex', async () => {
    const config = {...defaultConfig, ignorePattern: /Kiwi/};
    mockFs[path.join('/', 'project', 'fruits', 'Kiwi.js')] = `
      // Kiwi!
    `;

    mockFs[path.join('/', 'project', 'fruits', '.git', 'fruit-history.js')] = `
      // test
    `;
    const {hasteFS} = await (await HasteMap.create(config)).build();
    expect(hasteFS.matchFiles(/Kiwi/)).toEqual([]);
    expect(hasteFS.matchFiles('.git')).toEqual([]);
  }
```

#### builds a haste map on a fresh cache

```ts
it('builds a haste map on a fresh cache', async () => {
    // Include these files in the map
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'react', 'React.js')
    ] = `
      const Component = require("Component");
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'fbjs',
        'lib',
        'flatMap.js',
      )
    ] = `
      // flatMap
    `;

    // Ignore these
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'fbjs',
        'lib',
        'mapObject.js',
      )
    ] = `
      // mapObject
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'dummy',
        'merge.js',
      )
    ] = `
      // merge
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits',
        'node_modules',
        'react',
        'node_modules',
        'merge',
        'package.json',
      )
    ] = `
      {
        "name": "merge"
      }
    `;
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'jest', 'Jest.js')
    ] = `
      const Test = require("Test");
    `;
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'fbjs2', 'fbjs2.js')
    ] = `
      // fbjs2
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      mocksPattern: '__mocks__',
    });

    const {__hasteMapForTest: data} = await hasteMap.build();

    expect(data.clocks).toEqual(mockClocks);

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
        [path.join('fruits', 'Pear.js')]: [
          'Pear',
          32,
          42,
          1,
          'Banana\0Strawberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.js')]: [
          'Strawberry',
          32,
          42,
          1,
          '',
          null,
        ],
        [path.join('fruits', '__mocks__', 'Pear.js')]: [
          '',
          32,
          42,
          1,
          'Melon',
          null,
        ],
        [path.join('vegetables', 'Melon.js')]: ['Melon', 32, 42, 1, '', null],
      }),
    );

    expect(data.map).toEqual(
      createMap({
        Banana: {
          [H.GENERIC_PLATFORM]: [path.join('fruits', 'Banana.js'), H.MODULE],
        },
        Melon: {
          [H.GENERIC_PLATFORM]: [path.join('vegetables', 'Melon.js'), H.MODULE],
        },
        Pear: {
          [H.GENERIC_PLATFORM]: [path.join('fruits', 'Pear.js'), H.MODULE],
        },
        Strawberry: {
          [H.GENERIC_PLATFORM]: [
            path.join('fruits', 'Strawberry.js'),
            H.MODULE,
          ],
        },
      }),
    );

    expect(data.mocks).toEqual(
      createMap({
        Pear: path.join('fruits', '__mocks__', 'Pear.js'),
      }),
    );

    // The cache file must exactly mirror the data structure returned from a
    // build
    expect(useBuitinsInContext(hasteMap.read())).toEqual(data);
  }
```

#### does not crawl native files even if requested to do so

```ts
it('does not crawl native files even if requested to do so', async () => {
    mockFs[path.join('/', 'project', 'video', 'IRequireAVideo.js')] = `
      module.exports = require("./video.mp4");
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      extensions: [...defaultConfig.extensions],
      roots: [...defaultConfig.roots, path.join('/', 'project', 'video')],
    });

    const {__hasteMapForTest: data} = await hasteMap.build();

    expect(data.map.get('IRequireAVideo')).toBeDefined();
    expect(data.files.get(path.join('video', 'video.mp4'))).toBeDefined();
    expect(fs.readFileSync).not.toHaveBeenCalledWith(
      path.join('video', 'video.mp4'),
      'utf8',
    );
  }
```

#### retains all files if `retainAllFiles` is specified

```ts
it('retains all files if `retainAllFiles` is specified', async () => {
    mockFs[
      path.join('/', 'project', 'fruits', 'node_modules', 'fbjs', 'fbjs.js')
    ] = `
      // fbjs!
    `;

    const hasteMap = await HasteMap.create({
      ...defaultConfig,
      mocksPattern: '__mocks__',
      retainAllFiles: true,
    });

    const {__hasteMapForTest: data} = await hasteMap.build();
    // Expect the node module to be part of files but make sure it wasn't
    // read.
    expect(
      data.files.get(path.join('fruits', 'node_modules', 'fbjs', 'fbjs.js')),
    ).toEqual(['', 32, 42, 0, [], null]);

    expect(data.map.get('fbjs')).toBeUndefined();

    // cache file + 5 modules - the node_module
    expect(fs.readFileSync).toHaveBeenCalledTimes(6);
  });

  it('warns on duplicate mock files', async () => {
    expect.assertions(1);

    // Duplicate mock files for blueberry
    mockFs[
      path.join(
        '/',
        'project',
        'fruits1',
        '__mocks__',
        'subdir',
        'Blueberry.js',
      )
    ] = `
      // Blueberry
    `;
    mockFs[
      path.join(
        '/',
        'project',
        'fruits2',
        '__mocks__',
        'subdir',
        'Blueberry.js',
      )
    ] = `
      // Blueberry too!
    `;

    try {
      await (
        await HasteMap.create({
          mocksPattern: '__mocks__',
          throwOnModuleCollision: true,
          ...defaultConfig,
        })
      ).build();
    } catch {
      expect(
        console.error.mock.calls[0][0].replaceAll('\\', '/'),
      ).toMatchSnapshot();
    }
  });

  it('warns on duplicate module ids', async () => {
    mockFs[path.join('/', 'project', 'fruits', 'other', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    // Duplicate modules are removed so that it doesn't cause
    // non-determinism later on.
    expect(data.map.get('Strawberry')[H.GENERIC_PLATFORM]).toBeUndefined();

    expect(
      console.warn.mock.calls[0][0].replaceAll('\\', '/'),
    ).toMatchSnapshot();
  }
```

#### warns on duplicate module ids only once

```ts
it('warns on duplicate module ids only once', async () => {
    mockFs[path.join('/', 'project', 'fruits', 'other', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    await (await HasteMap.create(defaultConfig)).build();
    expect(console.warn).toHaveBeenCalledTimes(1);

    await (await HasteMap.create(defaultConfig)).build();
    expect(console.warn).toHaveBeenCalledTimes(1);
  }
```

#### throws on duplicate module ids if "throwOnModuleCollision" is set to true

```ts
it('throws on duplicate module ids if "throwOnModuleCollision" is set to true', async () => {
    expect.assertions(1);
    // Raspberry thinks it is a Strawberry
    mockFs[path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    try {
      await (
        await HasteMap.create({
          throwOnModuleCollision: true,
          ...defaultConfig,
        })
      ).build();
    } catch (error) {
      expect(error.message).toBe(
        'Duplicated files or mocks. Please check the console for more info',
      );
    }
  }
```

#### splits up modules by platform

```ts
it('splits up modules by platform', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;

    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;

    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.android.js')] = `
      const Blackberry = require("Blackberry");
    `;

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Strawberry.android.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Blackberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.ios.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Raspberry',
          null,
        ],
        [path.join('fruits', 'Strawberry.js')]: [
          'Strawberry',
          32,
          42,
          1,
          'Banana',
          null,
        ],
      }),
    );

    expect(data.map).toEqual(
      createMap({
        Strawberry: {
          [H.GENERIC_PLATFORM]: [
            path.join('fruits', 'Strawberry.js'),
            H.MODULE,
          ],
          android: [path.join('fruits', 'Strawberry.android.js'), H.MODULE],
          ios: [path.join('fruits', 'Strawberry.ios.js'), H.MODULE],
        },
      }),
    );
  }
```

#### does not access the file system on a warm cache with no changes

```ts
it('does not access the file system on a warm cache with no changes', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    // The first run should access the file system once for the (empty)
    // cache file and five times for the files in the system.
    expect(fs.readFileSync).toHaveBeenCalledTimes(6);

    fs.readFileSync.mockClear();

    // Explicitly mock that no files have changed.
    mockChangedFiles = Object.create(null);

    // Watchman would give us different clocks.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:4',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    if (require('v8').deserialize) {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath);
    } else {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath, 'utf8');
    }
    expect(useBuitinsInContext(data.clocks)).toEqual(mockClocks);
    expect(useBuitinsInContext(data.files)).toEqual(initialData.files);
    expect(useBuitinsInContext(data.map)).toEqual(initialData.map);
  }
```

#### only does minimal file system access when files change

```ts
it('only does minimal file system access when files change', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    fs.readFileSync.mockClear();

    // Let's assume one JS file has changed.
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Banana.js')]: `
            const Kiwi = require("Kiwi");
          `,
    });

    // Watchman would give us different clocks for `/project/fruits`.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:2',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(fs.readFileSync).toHaveBeenCalledTimes(2);

    if (require('v8').serialize) {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath);
    } else {
      expect(fs.readFileSync).toHaveBeenCalledWith(cacheFilePath, 'utf8');
    }
    expect(fs.readFileSync).toHaveBeenCalledWith(
      path.join('/', 'project', 'fruits', 'Banana.js'),
      'utf8',
    );

    expect(useBuitinsInContext(data.clocks)).toEqual(mockClocks);

    const files = new Map(initialData.files);
    files.set(path.join('fruits', 'Banana.js'), [
      'Banana',
      32,
      42,
      1,
      'Kiwi',
      null,
    ]);

    expect(useBuitinsInContext(data.files)).toEqual(files);

    const map = new Map(initialData.map);
    expect(useBuitinsInContext(data.map)).toEqual(map);
  });

  it('correctly handles file deletions', async () => {
    const {__hasteMapForTest: initialData} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    fs.readFileSync.mockClear();

    // Let's assume one JS file was removed.
    delete mockFs[path.join('/', 'project', 'fruits', 'Banana.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Banana.js')]: null,
    });

    // Watchman would give us different clocks for `/project/fruits`.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:2',
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    const files = new Map(initialData.files);
    files.delete(path.join('fruits', 'Banana.js'));
    expect(useBuitinsInContext(data.files)).toEqual(files);

    const map = new Map(initialData.map);
    map.delete('Banana');
    expect(useBuitinsInContext(data.map)).toEqual(map);
  }
```

#### correctly handles platform-specific file additions

```ts
it('correctly handles platform-specific file additions', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: `
        const Raspberry = require("Raspberry");
      `,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });
  }
```

#### correctly handles platform-specific file deletions

```ts
it('correctly handles platform-specific file deletions', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.js')] = `
      const Banana = require("Banana");
    `;
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: null,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });
  }
```

#### correctly handles platform-specific file renames

```ts
it('correctly handles platform-specific file renames', async () => {
    mockFs = Object.create(null);
    mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')] = `
      const Raspberry = require("Raspberry");
    `;
    let data;
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      ios: [path.join('fruits', 'Strawberry.ios.js'), 0],
    });

    delete mockFs[path.join('/', 'project', 'fruits', 'Strawberry.ios.js')];
    mockChangedFiles = object({
      [path.join('/', 'project', 'fruits', 'Strawberry.ios.js')]: null,
      [path.join('/', 'project', 'fruits', 'Strawberry.js')]: `
        const Banana = require("Banana");
      `,
    });
    mockClocks = createMap({fruits: 'c:fake-clock:3'});
    ({__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build());
    expect(data.map.get('Strawberry')).toEqual({
      g: [path.join('fruits', 'Strawberry.js'), 0],
    });
  }
```

#### recovers when a duplicate file is deleted

```ts
it('recovers when a duplicate file is deleted', async () => {
      delete mockFs[
        path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')
      ];
      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:3',
        vegetables: 'c:fake-clock:2',
      });

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();
      expect(useBuitinsInContext(data.duplicates)).toEqual(new Map());
      expect(data.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
      // Make sure the other files are not affected.
      expect(data.map.get('Banana')).toEqual({
        g: [path.join('fruits', 'Banana.js'), H.MODULE],
      });
    }
```

#### recovers with the correct type when a duplicate file is deleted

```ts
it('recovers with the correct type when a duplicate file is deleted', async () => {
      mockFs[
        path.join('/', 'project', 'fruits', 'strawberryPackage', 'package.json')
      ] = `
        {"name": "Strawberry"}
      `;

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();

      expect(useBuitinsInContext(data.duplicates)).toEqual(
        createMap({
          Strawberry: createMap({
            g: createMap({
              [path.join('fruits', 'Strawberry.js')]: H.MODULE,
              [path.join('fruits', 'another', 'Strawberry.js')]: H.MODULE,
              [path.join('fruits', 'strawberryPackage', 'package.json')]:
                H.PACKAGE,
            }),
          }),
        }),
      );

      delete mockFs[
        path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')
      ];
      delete mockFs[
        path.join('/', 'project', 'fruits', 'strawberryPackage', 'package.json')
      ];

      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
        [path.join(
          '/',
          'project',
          'fruits',
          'strawberryPackage',
          'package.json',
        )]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:4',
      });

      const {__hasteMapForTest: correctData} = await (
        await HasteMap.create(defaultConfig)
      ).build();

      expect(useBuitinsInContext(correctData.duplicates)).toEqual(new Map());
      expect(correctData.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
    }
```

#### recovers when a duplicate module is renamed

```ts
it('recovers when a duplicate module is renamed', async () => {
      mockChangedFiles = object({
        [path.join('/', 'project', 'fruits', 'another', 'Pineapple.js')]: `
          const Blackberry = require("Blackberry");
        `,
        [path.join('/', 'project', 'fruits', 'another', 'Strawberry.js')]: null,
      });
      mockClocks = createMap({
        fruits: 'c:fake-clock:3',
        vegetables: 'c:fake-clock:2',
      });

      const {__hasteMapForTest: data} = await (
        await HasteMap.create(defaultConfig)
      ).build();
      expect(useBuitinsInContext(data.duplicates)).toEqual(new Map());
      expect(data.map.get('Strawberry')).toEqual({
        g: [path.join('fruits', 'Strawberry.js'), H.MODULE],
      });
      expect(data.map.get('Pineapple')).toEqual({
        g: [path.join('fruits', 'another', 'Pineapple.js'), H.MODULE],
      });
      // Make sure the other files are not affected.
      expect(data.map.get('Banana')).toEqual({
        g: [path.join('fruits', 'Banana.js'), H.MODULE],
      });
    }
```

#### discards the cache when configuration changes

```ts
it('discards the cache when configuration changes', async () => {
    HasteMap.getCacheFilePath = getCacheFilePath;
    await (await HasteMap.create(defaultConfig)).build();
    fs.readFileSync.mockClear();

    // Explicitly mock that no files have changed.
    mockChangedFiles = Object.create(null);

    // Watchman would give us different clocks.
    mockClocks = createMap({
      fruits: 'c:fake-clock:3',
      vegetables: 'c:fake-clock:4',
    });

    const config = {...defaultConfig, ignorePattern: /Kiwi|Pear/};
    const {moduleMap} = await (await HasteMap.create(config)).build();
    expect(moduleMap.getModule('Pear')).toBeNull();
  }
```

#### ignores files that do not exist

```ts
it('ignores files that do not exist', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const mockImpl = watchman.getMockImplementation();
    // Wrap the watchman mock and add an invalid file to the file list.
    watchman.mockImplementation(options =>
      mockImpl(options).then(() => {
        const {data} = options;
        data.files.set(path.join('fruits', 'invalid', 'file.js'), [
          '',
          34,
          44,
          0,
          [],
        ]);
        return {hasteMap: data, removedFiles: new Map()};
      }),
    );

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(data.files.size).toBe(5);

    // Ensure this file is not part of the file list.
    expect(
      data.files.get(path.join('fruits', 'invalid', 'file.js')),
    ).toBeUndefined();
  }
```

#### distributes work across workers

```ts
it('distributes work across workers', async () => {
    const jestWorker = require('jest-worker').Worker;
    const path = require('path');
    const dependencyExtractor = path.join(__dirname, 'dependencyExtractor.js');
    const {__hasteMapForTest: data} = await (
      await HasteMap.create({
        ...defaultConfig,
        dependencyExtractor,
        hasteImplModulePath: undefined,
        maxWorkers: 4,
      })
    ).build();

    expect(jestWorker).toHaveBeenCalledTimes(1);

    expect(mockWorker).toHaveBeenCalledTimes(5);

    expect(mockWorker.mock.calls).toEqual([
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Banana.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Pear.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', 'Strawberry.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'fruits', '__mocks__', 'Pear.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
      [
        {
          computeDependencies: true,
          computeSha1: false,
          dependencyExtractor,
          filePath: path.join('/', 'project', 'vegetables', 'Melon.js'),
          hasteImplModulePath: undefined,
          rootDir: path.join('/', 'project'),
        },
      ],
    ]);

    expect(mockEnd).toHaveBeenCalled();
  }
```

#### tries to crawl using node as a fallback

```ts
it('tries to crawl using node as a fallback', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const node = require('../crawlers/node').nodeCrawl;

    watchman.mockImplementation(() => {
      throw new Error('watchman error');
    });
    node.mockImplementation(options => {
      const {data} = options;
      data.files = createMap({
        [path.join('fruits', 'Banana.js')]: ['', 32, 42, 0, '', null],
      });
      return Promise.resolve({
        hasteMap: data,
        removedFiles: new Map(),
      });
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();
    expect(watchman).toHaveBeenCalled();
    expect(node).toHaveBeenCalled();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
      }),
    );

    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
  }
```

#### tries to crawl using node as a fallback when promise fails once

```ts
it('tries to crawl using node as a fallback when promise fails once', async () => {
    const watchman = require('../crawlers/watchman').watchmanCrawl;
    const node = require('../crawlers/node').nodeCrawl;

    watchman.mockImplementation(() =>
      Promise.reject(new Error('watchman error')),
    );
    node.mockImplementation(options => {
      const {data} = options;
      data.files = createMap({
        [path.join('fruits', 'Banana.js')]: ['', 32, 42, 0, '', null],
      });
      return Promise.resolve({
        hasteMap: data,
        removedFiles: new Map(),
      });
    });

    const {__hasteMapForTest: data} = await (
      await HasteMap.create(defaultConfig)
    ).build();

    expect(watchman).toHaveBeenCalled();
    expect(node).toHaveBeenCalled();

    expect(data.files).toEqual(
      createMap({
        [path.join('fruits', 'Banana.js')]: [
          'Banana',
          32,
          42,
          1,
          'Strawberry',
          null,
        ],
      }),
    );
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/worker.test.js

#### parses JavaScript files and extracts module information

```ts
it('parses JavaScript files and extracts module information', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry'],
    });

    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Strawberry.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: [],
    });
  }
```

#### accepts a custom dependency extractor

```ts
it('accepts a custom dependency extractor', async () => {
    expect(
      await worker({
        computeDependencies: true,
        dependencyExtractor: path.join(__dirname, 'dependencyExtractor.js'),
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry', 'Lime'],
    });
  }
```

#### delegates to hasteImplModulePath for getting the id

```ts
it('delegates to hasteImplModulePath for getting the id', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        hasteImplModulePath: require.resolve('./haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: ['Banana', 'Strawberry'],
      id: 'Pear',
      module: [path.join('fruits', 'Pear.js'), H.MODULE],
    });

    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'fruits', 'Strawberry.js'),
        hasteImplModulePath: require.resolve('./haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: [],
      id: 'Strawberry',
      module: [path.join('fruits', 'Strawberry.js'), H.MODULE],
    });
  }
```

#### parses package.json files as haste packages

```ts
it('parses package.json files as haste packages', async () => {
    expect(
      await worker({
        computeDependencies: true,
        filePath: path.join('/project', 'package.json'),
        rootDir,
      }),
    ).toEqual({
      dependencies: undefined,
      id: 'haste-package',
      module: ['package.json', H.PACKAGE],
    });
  }
```

#### returns an error when a file cannot be accessed

```ts
it('returns an error when a file cannot be accessed', async () => {
    let error = null;

    try {
      await worker({computeDependencies: true, filePath: '/kiwi.js', rootDir});
    } catch (thrownError) {
      error = thrownError;
    }

    expect(error.message).toBe("Cannot read path '/kiwi.js'.");
  }
```

#### simply computes SHA-1s when requested (works well with binary data)

```ts
it('simply computes SHA-1s when requested (works well with binary data)', async () => {
    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'apple.png'),
        rootDir,
      }),
    ).toEqual({sha1: '4caece539b039b16e16206ea2478f8c5ffb2ca05'});

    expect(
      await getSha1({
        computeSha1: false,
        filePath: path.join('/project', 'fruits', 'Banana.js'),
        rootDir,
      }),
    ).toEqual({sha1: null});

    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'Banana.js'),
        rootDir,
      }),
    ).toEqual({sha1: '7772b628e422e8cf59c526be4bb9f44c0898e3d1'});

    expect(
      await getSha1({
        computeSha1: true,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        rootDir,
      }),
    ).toEqual({sha1: 'c7a7a68a1c8aaf452669dd2ca52ac4a434d25552'});

    await expect(
      getSha1({computeSha1: true, filePath: '/i/dont/exist.js', rootDir}),
    ).rejects.toThrow("Cannot read path '/i/dont/exist.js'.");
  }
```

#### avoids computing dependencies if not requested and Haste does not need it

```ts
it('avoids computing dependencies if not requested and Haste does not need it', async () => {
    expect(
      await worker({
        computeDependencies: false,
        filePath: path.join('/project', 'fruits', 'Pear.js'),
        hasteImplModulePath: path.resolve(__dirname, 'haste_impl.js'),
        rootDir,
      }),
    ).toEqual({
      dependencies: undefined,
      id: 'Pear',
      module: [path.join('fruits', 'Pear.js'), H.MODULE],
      sha1: undefined,
    });

    // Ensure not disk access happened.
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(fs.readFile).not.toHaveBeenCalled();
  }
```

### ../../../../../.ctest/repos/14937caf7b-cyclonedx-npm/tests/integration/cli.edge-cases.test.js

#### unsupported NPM version

```ts
test('unsupported NPM version', async () => {
    const logFileBase = join(tmpRoot, 'unsupported-npm-version')
    const cwd = join(dummyProjectsRoot, 'with-lockfile')

    const npmVersion = [
      Math.round((NPM_LOWEST_SUPPORTED[0] - 1) * Math.random()),
      Math.round(99 * Math.random()),
      Math.round(99 * Math.random())
    ]

    const { res, errFile } = runCLI([], logFileBase, cwd, {
      CT_VERSION: npmVersion.join('.'),
      npm_execpath: npmLsReplacement.justExit
    })

    try {
      await expect(res).rejects.toThrow(/Unsupported NPM version/i)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }
  }
```

#### error on non-existing binary

```ts
test('error on non-existing binary', async () => {
      const logFileBase = join(tmpRootRun, 'non-existing')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        npm_execpath: npmLsReplacement.nonExistingBinary
      })

      try {
        await expect(res).rejects.toThrow(/^unexpected npm execpath/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on non-zero exit

```ts
test('error on non-zero exit', async () => {
      const logFileBase = join(tmpRootRun, 'error-exit-nonzero')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const expectedExitCode = 1 + Math.floor(254 * Math.random())

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // non-zero exit code
        CT_EXIT_CODE: `${expectedExitCode}`,
        npm_execpath: npmLsReplacement.justExit
      })

      try {
        await expect(res).rejects.toThrow(`npm-ls exited with errors: ${expectedExitCode} noSignal`)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on broken json response

```ts
test('error on broken json response', async () => {
      const logFileBase = join(tmpRootRun, 'error-json-broken')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // abuse the npm-ls replacement, as it can be caused to crash under control.
        npm_execpath: npmLsReplacement.brokenJson
      })

      try {
        await expect(res).rejects.toThrow(/failed to parse npm-ls response/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### suppressed error on non-zero exit

```ts
test('suppressed error on non-zero exit', async () => {
    const dd = {
      subject: 'dev-dependencies',
      npm: NPM_LOWEST_SUPPORTED[0],
      node: '20',
      os: 'ubuntu-latest'
    }

    mkdirSync(join(tmpRoot, 'suppressed-error-on-non-zero-exit'))
    const expectedOutSnap = join(demoResultsRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}.snap.json`)
    const logFileBase = join(tmpRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}`)
    const cwd = dummyProjectsRoot

    // non-zero exit code
    const expectedExitCode = 1 + Math.floor(254 * Math.random())

    const { res, outFile, errFile } = runCLI([
      '-vvv',
      '--ignore-npm-errors',
      '--output-reproducible',
      // no intention to test all the spec-versions nor all the output-formats - this would be not our scope.
      '--spec-version', `${latestCdxSpecVersion}`,
      '--output-format', 'JSON',
      // prevent file interaction in this synthetic scenario - they would not exist anyway
      '--package-lock-only',
      '--',
      join('with-lockfile', 'package.json')
    ], logFileBase, cwd, {
      CT_VERSION: `${dd.npm}.99.0`,
      CT_EXIT_CODE: expectedExitCode,
      CT_SUBJECT: dd.subject,
      CT_NPM: dd.npm,
      CT_NODE: dd.node,
      CT_OS: dd.os,
      npm_execpath: npmLsReplacement.demoResults
    })

    try {
      await expect(res).resolves.toBe(0)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }

    const actualOutput = makeReproducible('json', readFileSync(outFile, 'utf8'))

    if (UPDATE_SNAPSHOTS) {
      mkdirSync(dirname(expectedOutSnap), { recursive: true })
      writeFileSync(expectedOutSnap, actualOutput, 'utf8')
    }

    expect(actualOutput).toEqual(
      readFileSync(expectedOutSnap, 'utf8'),
      `${outFile} should equal ${expectedOutSnap}`
    )
  }
```

### ../../../../../.ctest/repos/9597e02587-@cyclonedx_cyclonedx-npm/tests/integration/cli.edge-cases.test.js

#### unsupported NPM version

```ts
test('unsupported NPM version', async () => {
    const logFileBase = join(tmpRoot, 'unsupported-npm-version')
    const cwd = join(dummyProjectsRoot, 'with-lockfile')

    const npmVersion = [
      Math.round((NPM_LOWEST_SUPPORTED[0] - 1) * Math.random()),
      Math.round(99 * Math.random()),
      Math.round(99 * Math.random())
    ]

    const { res, errFile } = runCLI([], logFileBase, cwd, {
      CT_VERSION: npmVersion.join('.'),
      npm_execpath: npmLsReplacement.justExit
    })

    try {
      await expect(res).rejects.toThrow(/Unsupported NPM version/i)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }
  }
```

#### error on non-existing binary

```ts
test('error on non-existing binary', async () => {
      const logFileBase = join(tmpRootRun, 'non-existing')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        npm_execpath: npmLsReplacement.nonExistingBinary
      })

      try {
        await expect(res).rejects.toThrow(/^unexpected npm execpath/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on non-zero exit

```ts
test('error on non-zero exit', async () => {
      const logFileBase = join(tmpRootRun, 'error-exit-nonzero')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const expectedExitCode = 1 + Math.floor(254 * Math.random())

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // non-zero exit code
        CT_EXIT_CODE: `${expectedExitCode}`,
        npm_execpath: npmLsReplacement.justExit
      })

      try {
        await expect(res).rejects.toThrow(`npm-ls exited with errors: ${expectedExitCode} noSignal`)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### error on broken json response

```ts
test('error on broken json response', async () => {
      const logFileBase = join(tmpRootRun, 'error-json-broken')
      const cwd = join(dummyProjectsRoot, 'with-lockfile')

      const { res, errFile } = runCLI([], logFileBase, cwd, {
        // abuse the npm-ls replacement, as it can be caused to crash under control.
        npm_execpath: npmLsReplacement.brokenJson
      })

      try {
        await expect(res).rejects.toThrow(/failed to parse npm-ls response/i)
      } catch (err) {
        process.stderr.write(readFileSync(errFile))
        throw err
      }
    }
```

#### suppressed error on non-zero exit

```ts
test('suppressed error on non-zero exit', async () => {
    const dd = {
      subject: 'dev-dependencies',
      npm: NPM_LOWEST_SUPPORTED[0],
      node: '20',
      os: 'ubuntu-latest'
    }

    mkdirSync(join(tmpRoot, 'suppressed-error-on-non-zero-exit'))
    const expectedOutSnap = join(demoResultsRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}.snap.json`)
    const logFileBase = join(tmpRoot, 'suppressed-error-on-non-zero-exit', `${dd.subject}_npm${dd.npm}_node${dd.node}_${dd.os}`)
    const cwd = dummyProjectsRoot

    // non-zero exit code
    const expectedExitCode = 1 + Math.floor(254 * Math.random())

    const { res, outFile, errFile } = runCLI([
      '-vvv',
      '--ignore-npm-errors',
      '--output-reproducible',
      // no intention to test all the spec-versions nor all the output-formats - this would be not our scope.
      '--spec-version', `${latestCdxSpecVersion}`,
      '--output-format', 'JSON',
      // prevent file interaction in this synthetic scenario - they would not exist anyway
      '--package-lock-only',
      '--',
      join('with-lockfile', 'package.json')
    ], logFileBase, cwd, {
      CT_VERSION: `${dd.npm}.99.0`,
      CT_EXIT_CODE: expectedExitCode,
      CT_SUBJECT: dd.subject,
      CT_NPM: dd.npm,
      CT_NODE: dd.node,
      CT_OS: dd.os,
      npm_execpath: npmLsReplacement.demoResults
    })

    try {
      await expect(res).resolves.toBe(0)
    } catch (err) {
      process.stderr.write(readFileSync(errFile))
      throw err
    }

    const actualOutput = makeReproducible('json', readFileSync(outFile, 'utf8'))

    if (UPDATE_SNAPSHOTS) {
      mkdirSync(dirname(expectedOutSnap), { recursive: true })
      writeFileSync(expectedOutSnap, actualOutput, 'utf8')
    }

    expect(actualOutput).toEqual(
      readFileSync(expectedOutSnap, 'utf8'),
      `${outFile} should equal ${expectedOutSnap}`
    )
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-config/src/__tests__/readConfigFileAndSetRootDir.test.ts

#### reads config and sets `rootDir`

```ts
test('reads config and sets `rootDir`', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({notify: true});

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({notify: true, rootDir});
    }
```

#### handles exported function

```ts
test('handles exported function', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(() => ({bail: 1}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({bail: 1, rootDir});
    }
```

#### handles exported async function

```ts
test('handles exported async function', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(async () => ({testTimeout: 10_000}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({rootDir, testTimeout: 10_000});
    }
```

#### reads config and sets `rootDir`

```ts
test('reads config and sets `rootDir`', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "verbose": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({rootDir, verbose: true});
    }
```

#### supports comments in JSON

```ts
test('supports comments in JSON', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ // test comment\n "bail": true }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.json'),
      );

      expect(config).toEqual({bail: true, rootDir});
    }
```

#### reads config from "jest" key and sets `rootDir`

```ts
test('reads config from "jest" key and sets `rootDir`', async () => {
      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce('{ "jest": { "coverage": true } }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({coverage: true, rootDir});
    }
```

#### sets rootDir if "jest" is absent

```ts
test('sets rootDir if "jest" is absent', async () => {
      jest.mocked(fs.readFileSync).mockReturnValueOnce('{ "name": "test" }');

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'package.json'),
      );

      expect(config).toEqual({rootDir});
    }
```

#### handles frozen config object

```ts
test('handles frozen config object', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockResolvedValueOnce(Object.freeze({preset: 'some-preset'}));

      const rootDir = path.resolve('some', 'path', 'to');
      const config = await readConfigFileAndSetRootDir(
        path.join(rootDir, 'jest.config.js'),
      );

      expect(config).toEqual({preset: 'some-preset', rootDir});
    }
```

#### keeps the path if it is absolute

```ts
test('keeps the path if it is absolute', async () => {
      const rootDir = path.resolve('some', 'path', 'to');
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({
        rootDir,
        testEnvironment: 'node',
      });

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('other', 'path', 'to'), 'jest.config.js'),
      );

      expect(config).toEqual({rootDir, testEnvironment: 'node'});
    }
```

#### resolves the path relative to dirname of the config file

```ts
test('resolves the path relative to dirname of the config file', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce({
        restoreMocks: true,
        rootDir: path.join('path', 'to'),
      });

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('some'), 'jest.config.js'),
      );

      expect(config).toEqual({
        restoreMocks: true,
        rootDir: path.resolve('some', 'path', 'to'),
      });
    }
```

#### resolves relative path when the read config object if frozen

```ts
test('resolves relative path when the read config object if frozen', async () => {
      jest.mocked(requireOrImportModule).mockResolvedValueOnce(
        Object.freeze({
          resetModules: true,
          rootDir: path.join('path', 'to'),
        }),
      );

      const config = await readConfigFileAndSetRootDir(
        path.join(path.resolve('some'), 'jest.config.js'),
      );

      expect(config).toEqual({
        resetModules: true,
        rootDir: path.resolve('some', 'path', 'to'),
      });
    }
```

#### reaches into 2nd loadout by TS loader if specified in docblock

```ts
test('reaches into 2nd loadout by TS loader if specified in docblock', async () => {
      jest
        .mocked(requireOrImportModule)
        .mockRejectedValueOnce(new Error('Module not found'));
      jest.mocked(fs.readFileSync).mockReturnValue(`
        /** @jest-config-loader tsx */
        export { testTimeout: 1_000 }
      `);
      const rootDir = path.resolve('some', 'path', 'to');
      await expect(
        readConfigFileAndSetRootDir(path.join(rootDir, 'jest.config.ts')),
      ).rejects.toThrow(
        /Module not found\n.*'tsx' is not a valid TypeScript configuration loader./,
      );
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/res.render.js

#### should support absolute paths

```ts
it('should support absolute paths', function(done){
      var app = createApp();

      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render(path.join(__dirname, 'fixtures', 'user.tmpl'))
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should support absolute paths with "view engine"

```ts
it('should support absolute paths with "view engine"', function(done){
      var app = createApp();

      app.locals.user = { name: 'tobi' };
      app.set('view engine', 'tmpl');

      app.use(function(req, res){
        res.render(path.join(__dirname, 'fixtures', 'user'))
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should error without "view engine" set and file extension to a non-engine module

```ts
it('should error without "view engine" set and file extension to a non-engine module', function (done) {
      var app = createApp()

      app.locals.user = { name: 'tobi' }

      app.use(function (req, res) {
        res.render(path.join(__dirname, 'fixtures', 'broken.send'))
      })

      request(app)
      .get('/')
      .expect(500, /does not provide a view engine/, done)
    }
```

#### should error without "view engine" set and no file extension

```ts
it('should error without "view engine" set and no file extension', function (done) {
      var app = createApp();

      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render(path.join(__dirname, 'fixtures', 'user'))
      });

      request(app)
      .get('/')
      .expect(500, /No default engine was specified/, done);
    }
```

#### should expose app.locals

```ts
it('should expose app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.render('user.tmpl');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should expose app.locals with `name` property

```ts
it('should expose app.locals with `name` property', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.name = 'tobi';

      app.use(function(req, res){
        res.render('name.tmpl');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should support index.<engine>

```ts
it('should support index.<engine>', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.set('view engine', 'tmpl');

      app.use(function(req, res){
        res.render('blog/post');
      });

      request(app)
      .get('/')
      .expect('<h1>blog post</h1>', done);
    }
```

#### should next(err)

```ts
it('should next(err)', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.use(function(req, res){
          res.render('user.tmpl');
        });

        app.use(function(err, req, res, next){
          res.status(500).send('got error: ' + err.name)
        });

        request(app)
        .get('/')
        .expect(500, 'got error: RenderError', done)
      }
```

#### should render the template

```ts
it('should render the template', function(done){
        var app = createApp();

        app.set('view engine', 'tmpl');
        app.set('views', path.join(__dirname, 'fixtures'))

        app.use(function(req, res){
          res.render('email');
        });

        request(app)
        .get('/')
        .expect('<p>This is an email</p>', done);
      }
```

#### should lookup the file in the path

```ts
it('should lookup the file in the path', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures', 'default_layout'))

        app.use(function(req, res){
          res.render('user.tmpl', { user: { name: 'tobi' } });
        });

        request(app)
        .get('/')
        .expect('<p>tobi</p>', done);
      }
```

#### should lookup the file in the path

```ts
it('should lookup the file in the path', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);

          app.use(function(req, res){
            res.render('user.tmpl', { user: { name: 'tobi' } });
          });

          request(app)
          .get('/')
          .expect('<span>tobi</span>', done);
        }
```

#### should lookup in later paths until found

```ts
it('should lookup in later paths until found', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);

          app.use(function(req, res){
            res.render('name.tmpl', { name: 'tobi' });
          });

          request(app)
          .get('/')
          .expect('<p>tobi</p>', done);
        }
```

#### should render the template

```ts
it('should render the template', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      var user = { name: 'tobi' };

      app.use(function(req, res){
        res.render('user.tmpl', { user: user });
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should expose res.locals

```ts
it('should expose res.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.tmpl');
      });

      request(app)
      .get('/')
      .expect('<p>tobi</p>', done);
    }
```

#### should give precedence to res.locals over app.locals

```ts
it('should give precedence to res.locals over app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.use(function(req, res){
        res.locals.user = { name: 'jane' };
        res.render('user.tmpl', {});
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    }
```

#### should give precedence to res.render() locals over res.locals

```ts
it('should give precedence to res.render() locals over res.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      var jane = { name: 'jane' };

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.tmpl', { user: jane });
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    }
```

#### should give precedence to res.render() locals over app.locals

```ts
it('should give precedence to res.render() locals over app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };
      var jane = { name: 'jane' };

      app.use(function(req, res){
        res.render('user.tmpl', { user: jane });
      });

      request(app)
      .get('/')
      .expect('<p>jane</p>', done);
    }
```

#### should pass the resulting string

```ts
it('should pass the resulting string', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use(function(req, res){
        var tobi = { name: 'tobi' };
        res.render('user.tmpl', { user: tobi }, function (err, html) {
          html = html.replace('tobi', 'loki');
          res.end(html);
        });
      });

      request(app)
      .get('/')
      .expect('<p>loki</p>', done);
    }
```

#### should pass the resulting string

```ts
it('should pass the resulting string', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      app.use(function(req, res){
        res.locals.user = { name: 'tobi' };
        res.render('user.tmpl', function (err, html) {
          html = html.replace('tobi', 'loki');
          res.end(html);
        });
      });

      request(app)
      .get('/')
      .expect('<p>loki</p>', done);
    }
```

#### should pass it to the callback

```ts
it('should pass it to the callback', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.use(function(req, res){
          res.render('user.tmpl', function (err) {
            if (err) {
              res.status(500).send('got error: ' + err.name)
            }
          });
        });

        request(app)
        .get('/')
        .expect(500, 'got error: RenderError', done)
      }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/e2e/__tests__/hasteMapSha1.test.ts

#### exits the process after test are done but before timers complete

```ts
test('exits the process after test are done but before timers complete', async () => {
  writeFiles(DIR, {
    'file.android.js': '"foo android"',
    'file.ios.js': '"foo ios"',
    'file.js': '"foo default"',
    'fileWithExtension.ignored': '"ignored file"',
    'node_modules/bar/fileWithExtension.ignored': '"ignored node modules"',
    'node_modules/bar/image.png': '"an image"',
    'node_modules/bar/index.js': '"node modules bar"',
  });

  const haste = await JestHasteMap.create({
    computeSha1: true,
    extensions: ['js', 'json', 'png'],
    forceNodeFilesystemAPI: true,
    id: 'tmp',
    ignorePattern: / ^/,
    maxWorkers: 2,
    mocksPattern: '',
    platforms: ['ios', 'android'],
    retainAllFiles: true,
    rootDir: DIR,
    roots: [DIR],
    useWatchman: false,
    watch: false,
  });

  const {hasteFS} = await haste.build();

  expect(hasteFS.getSha1(path.join(DIR, 'file.android.js'))).toBe(
    'e376f9fd9a96d000fa019020159f996a8855f8bc',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'file.ios.js'))).toBe(
    '1271b4db2a5f47ae46cb01a1d0604a94d401e8f7',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'file.js'))).toBe(
    'c26c852220977244418f17a9fdc4ae9c192b3188',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'node_modules/bar/image.png'))).toBe(
    '8688f7e11f63d8a7eac7cb87af850337fabbd400',
  );

  expect(hasteFS.getSha1(path.join(DIR, 'node_modules/bar/index.js'))).toBe(
    'ee245b9fbd45e1f6ad300eb2f5484844f6b5a34c',
  );

  // Ignored files do not get the SHA-1 computed.

  expect(
    hasteFS.getSha1(path.join(DIR, 'fileWithExtension.ignored')),
  ).toBeNull();

  expect(
    hasteFS.getSha1(
      path.join(DIR, 'node_modules/bar/fileWithExtension.ignored'),
    ),
  ).toBeNull();
}
```

### ../../../../../.ctest/repos/95324de690-parser/packages/babel-code-frame/test/color-detection.js

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );

      const codeResult = result.match(/console.*?babel/)[0];
      const codeStripped = stripAnsi(codeResult);
      expect(codeResult.length).toBeGreaterThan(codeStripped.length);
    }
```

#### opts.highlightCode with multiple columns and lines

```ts
test("opts.highlightCode with multiple columns and lines", function () {
      // prettier-ignore
      const rawLines = [
      "function a(b, c) {",
      "  return b + c;",
      "}"
    ].join("\n");

      const result = codeFrameColumns(
        rawLines,
        {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 3,
            column: 1,
          },
        },
        {
          highlightCode: true,
          message: "Message about things",
        },
      );
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        // prettier-ignore
        [
        "> 1 | function a(b, c) {",
        "    | ^^^^^^^^^^^^^^^^^^",
        "> 2 |   return b + c;",
        "    | ^^^^^^^^^^^^^^^",
        "> 3 | }",
        "    | ^ Message about things",
      ].join('\n'),
      );
    }
```

#### opts.forceColor

```ts
test("opts.forceColor", function () {
      const marker = compose(colors.red, colors.bold);
      const gutter = colors.gray;

      const rawLines = ["", "", "", ""].join("\n");
      expect(
        codeFrame(rawLines, 3, null, {
          linesAbove: 1,
          linesBelow: 1,
          forceColor: true,
        }),
      ).toEqual(
        colors.reset(
          [
            " " + gutter(" 2 |"),
            marker(">") + gutter(" 3 |"),
            " " + gutter(" 4 |"),
          ].join("\n"),
        ),
      );
    }
```

#### jsx

```ts
test("jsx", function () {
      const gutter = colors.gray;
      const yellow = colors.yellow;

      const rawLines = ["<div />"].join("\n");

      expect(
        JSON.stringify(
          codeFrame(rawLines, 0, null, {
            linesAbove: 1,
            linesBelow: 1,
            forceColor: true,
          }),
        ),
      ).toEqual(
        JSON.stringify(
          colors.reset(
            " " +
              gutter(" 1 |") +
              " " +
              yellow("<") +
              yellow("div") +
              " " +
              yellow("/") +
              yellow(">"),
          ),
        ),
      );
    }
```

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result).toBe(stripped);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );
    }
```

### ../../../../../.ctest/repos/cc6b13a61c-@babel_parser/packages/babel-code-frame/test/color-detection.js

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );

      const codeResult = result.match(/console.*?babel/)[0];
      const codeStripped = stripAnsi(codeResult);
      expect(codeResult.length).toBeGreaterThan(codeStripped.length);
    }
```

#### opts.highlightCode with multiple columns and lines

```ts
test("opts.highlightCode with multiple columns and lines", function () {
      // prettier-ignore
      const rawLines = [
      "function a(b, c) {",
      "  return b + c;",
      "}"
    ].join("\n");

      const result = codeFrameColumns(
        rawLines,
        {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 3,
            column: 1,
          },
        },
        {
          highlightCode: true,
          message: "Message about things",
        },
      );
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        // prettier-ignore
        [
        "> 1 | function a(b, c) {",
        "    | ^^^^^^^^^^^^^^^^^^",
        "> 2 |   return b + c;",
        "    | ^^^^^^^^^^^^^^^",
        "> 3 | }",
        "    | ^ Message about things",
      ].join('\n'),
      );
    }
```

#### opts.forceColor

```ts
test("opts.forceColor", function () {
      const marker = compose(colors.red, colors.bold);
      const gutter = colors.gray;

      const rawLines = ["", "", "", ""].join("\n");
      expect(
        codeFrame(rawLines, 3, null, {
          linesAbove: 1,
          linesBelow: 1,
          forceColor: true,
        }),
      ).toEqual(
        colors.reset(
          [
            " " + gutter(" 2 |"),
            marker(">") + gutter(" 3 |"),
            " " + gutter(" 4 |"),
          ].join("\n"),
        ),
      );
    }
```

#### jsx

```ts
test("jsx", function () {
      const gutter = colors.gray;
      const yellow = colors.yellow;

      const rawLines = ["<div />"].join("\n");

      expect(
        JSON.stringify(
          codeFrame(rawLines, 0, null, {
            linesAbove: 1,
            linesBelow: 1,
            forceColor: true,
          }),
        ),
      ).toEqual(
        JSON.stringify(
          colors.reset(
            " " +
              gutter(" 1 |") +
              " " +
              yellow("<") +
              yellow("div") +
              " " +
              yellow("/") +
              yellow(">"),
          ),
        ),
      );
    }
```

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result).toBe(stripped);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );
    }
```

### ../../../../../.ctest/repos/e7b1fff700-types/packages/babel-code-frame/test/color-detection.js

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );

      const codeResult = result.match(/console.*?babel/)[0];
      const codeStripped = stripAnsi(codeResult);
      expect(codeResult.length).toBeGreaterThan(codeStripped.length);
    }
```

#### opts.highlightCode with multiple columns and lines

```ts
test("opts.highlightCode with multiple columns and lines", function () {
      // prettier-ignore
      const rawLines = [
      "function a(b, c) {",
      "  return b + c;",
      "}"
    ].join("\n");

      const result = codeFrameColumns(
        rawLines,
        {
          start: {
            line: 1,
            column: 1,
          },
          end: {
            line: 3,
            column: 1,
          },
        },
        {
          highlightCode: true,
          message: "Message about things",
        },
      );
      const stripped = stripAnsi(result);
      expect(result.length).toBeGreaterThan(stripped.length);
      expect(stripped).toEqual(
        // prettier-ignore
        [
        "> 1 | function a(b, c) {",
        "    | ^^^^^^^^^^^^^^^^^^",
        "> 2 |   return b + c;",
        "    | ^^^^^^^^^^^^^^^",
        "> 3 | }",
        "    | ^ Message about things",
      ].join('\n'),
      );
    }
```

#### opts.forceColor

```ts
test("opts.forceColor", function () {
      const marker = compose(colors.red, colors.bold);
      const gutter = colors.gray;

      const rawLines = ["", "", "", ""].join("\n");
      expect(
        codeFrame(rawLines, 3, null, {
          linesAbove: 1,
          linesBelow: 1,
          forceColor: true,
        }),
      ).toEqual(
        colors.reset(
          [
            " " + gutter(" 2 |"),
            marker(">") + gutter(" 3 |"),
            " " + gutter(" 4 |"),
          ].join("\n"),
        ),
      );
    }
```

#### jsx

```ts
test("jsx", function () {
      const gutter = colors.gray;
      const yellow = colors.yellow;

      const rawLines = ["<div />"].join("\n");

      expect(
        JSON.stringify(
          codeFrame(rawLines, 0, null, {
            linesAbove: 1,
            linesBelow: 1,
            forceColor: true,
          }),
        ),
      ).toEqual(
        JSON.stringify(
          colors.reset(
            " " +
              gutter(" 1 |") +
              " " +
              yellow("<") +
              yellow("div") +
              " " +
              yellow("/") +
              yellow(">"),
          ),
        ),
      );
    }
```

#### opts.highlightCode

```ts
test("opts.highlightCode", function () {
      const rawLines = "console.log('babel')";
      const result = codeFrame(rawLines, 1, 9, { highlightCode: true });
      const stripped = stripAnsi(result);
      expect(result).toBe(stripped);
      expect(stripped).toEqual(
        ["> 1 | console.log('babel')", "    |         ^"].join("\n"),
      );
    }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-core/src/__tests__/SnapshotInteractiveMode.test.js

#### call to run process the first file

```ts
test('call to run process the first file', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### call to abort

```ts
test('call to abort', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    instance.abort();
    expect(instance.isActive()).toBeFalsy();
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenCalledWith(null, false);
  }
```

#### call to reset

```ts
test('call to reset', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'second.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(instance.isActive()).toBeTruthy();
    instance.restart();
    expect(instance.isActive()).toBeTruthy();
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### press ENTER trigger a run

```ts
test('press ENTER trigger a run', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];
    instance.run(assertions, mockCallback);
    instance.put(KEYS.ENTER);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith(assertions[0], false);
  }
```

#### skip 1 test, then restart

```ts
test('skip 1 test, then restart', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### skip 1 test, then quit

```ts
test('skip 1 test, then quit', () => {
    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('q');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(2, null, false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  }
```

#### update 1 test, then finish and return

```ts
test('update 1 test, then finish and return', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [{fullName: 'test one', path: 'first.js'}];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();

    instance.put(KEYS.ENTER);
    expect(instance.isActive()).toBe(false);
    expect(mockCallback).toHaveBeenNthCalledWith(3, null, false);
  }
```

#### skip 2 tests, then finish and restart

```ts
test('skip 2 tests, then finish and restart', () => {
    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];
    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### update 2 tests, then finish and return

```ts
test('update 2 tests, then finish and return', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[1], true);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put(KEYS.ENTER);
    expect(instance.isActive()).toBe(false);
    expect(mockCallback).toHaveBeenNthCalledWith(5, null, false);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  }
```

#### update 1 test, skip 1 test, then finish and restart

```ts
test('update 1 test, skip 1 test, then finish and restart', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[0], true);
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

#### skip 1 test, update 1 test, then finish and restart

```ts
test('skip 1 test, update 1 test, then finish and restart', () => {
    const mockCallback = jest.fn();
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: false}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });
    mockCallback.mockImplementationOnce(() => {
      instance.updateWithResults({snapshot: {failure: true}});
    });

    const assertions = [
      {fullName: 'test one', path: 'first.js'},
      {fullName: 'test two', path: 'first.js'},
    ];

    instance.run(assertions, mockCallback);
    expect(mockCallback).toHaveBeenNthCalledWith(1, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('s');
    expect(mockCallback).toHaveBeenNthCalledWith(2, assertions[1], false);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('u');
    expect(mockCallback).toHaveBeenNthCalledWith(3, assertions[1], true);
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
    pipe.write.mockClear();

    instance.put('r');
    expect(instance.getSkippedNum()).toBe(0);
    expect(mockCallback).toHaveBeenNthCalledWith(4, assertions[0], false);
    expect(mockCallback).toHaveBeenCalledTimes(4);
    expect(pipe.write.mock.calls.join('\n')).toMatchSnapshot();
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-haste-map/src/__tests__/get_mock_name.test.js

#### extracts mock name from file path

```ts
it('extracts mock name from file path', () => {
    expect(getMockName(path.join('a', '__mocks__', 'c.js'))).toBe('c');

    expect(getMockName(path.join('a', '__mocks__', 'c', 'd.js'))).toBe(
      path.join('c', 'd').replaceAll('\\', '/'),
    );
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-resolve-dependencies/src/__tests__/dependency_resolver.test.ts

#### resolves no dependencies for non-existent path

```ts
test('resolves no dependencies for non-existent path', () => {
  const resolved = dependencyResolver.resolve('/non/existent/path');
  expect(resolved).toHaveLength(0);
}
```

#### resolves dependencies for existing path

```ts
test('resolves dependencies for existing path', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining('jest-resolve-dependencies'),
    expect.stringContaining('jest-regex-util'),
  ]);
}
```

#### includes the mocks of dependencies as dependencies

```ts
test('includes the mocks of dependencies as dependencies', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__/hasMocked/file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('hasMocked', 'file.js')),
    expect.stringContaining(path.join('hasMocked', '__mocks__', 'file.js')),
    expect.stringContaining(path.join('__mocks__', 'fake-node-module.js')),
  ]);
}
```

#### resolves dependencies for scoped packages

```ts
test('resolves dependencies for scoped packages', () => {
  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'scoped.js'),
  );
  expect(resolved).toEqual([
    expect.stringContaining(path.join('@myorg', 'pkg')),
  ]);
}
```

#### resolves no inverse dependencies for empty paths set

```ts
test('resolves no inverse dependencies for empty paths set', () => {
  const paths = new Set<string>();
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toHaveLength(0);
}
```

#### resolves no inverse dependencies for set of non-existent paths

```ts
test('resolves no inverse dependencies for set of non-existent paths', () => {
  const paths = new Set(['/non/existent/path', '/another/one']);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toHaveLength(0);
}
```

#### resolves inverse dependencies for existing path

```ts
test('resolves inverse dependencies for existing path', () => {
  const paths = new Set([path.resolve(__dirname, '__fixtures__/file.js')]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__', '__fixtures__', 'file.test.js'),
    ),
  ]);
}
```

#### resolves inverse dependencies of mock

```ts
test('resolves inverse dependencies of mock', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/hasMocked/__mocks__/file.js'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);

  expect(resolved).toEqual([
    expect.stringContaining(
      path.join('__tests__/__fixtures__/hasMocked/file.test.js'),
    ),
  ]);
}
```

#### resolves inverse dependencies from available snapshot

```ts
test('resolves inverse dependencies from available snapshot', () => {
  const paths = new Set([
    path.resolve(__dirname, '__fixtures__/file.js'),
    path.resolve(__dirname, '__fixtures__/__snapshots__/related.test.js.snap'),
  ]);
  const resolved = dependencyResolver.resolveInverse(paths, filter);
  expect(resolved).toEqual(
    expect.arrayContaining([
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'file.test.js'),
      ),
      expect.stringContaining(
        path.join('__tests__', '__fixtures__', 'related.test.js'),
      ),
    ]),
  );
}
```

#### resolves dependencies correctly when dependency resolution fails

```ts
test('resolves dependencies correctly when dependency resolution fails', () => {
  jest.spyOn(runtimeContextResolver, 'resolveModule').mockImplementation(() => {
    throw new Error('resolveModule has failed');
  });
  jest.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([]);
}
```

#### resolves dependencies correctly when mock dependency resolution fails

```ts
test('resolves dependencies correctly when mock dependency resolution fails', () => {
  jest.spyOn(runtimeContextResolver, 'getMockModule').mockImplementation(() => {
    throw new Error('getMockModule has failed');
  });

  const resolved = dependencyResolver.resolve(
    path.resolve(__dirname, '__fixtures__', 'file.test.js'),
  );

  expect(resolved).toEqual([
    expect.stringContaining(path.join('__tests__', '__fixtures__', 'file.js')),
  ]);
}
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/e2e/__tests__/coverageProviderV8.test.ts

#### prints coverage with missing sourcemaps

```ts
test('prints coverage with missing sourcemaps', () => {
  const sourcemapDir = path.join(DIR, 'no-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints coverage with empty sourcemaps

```ts
test('prints coverage with empty sourcemaps', () => {
  const sourcemapDir = path.join(DIR, 'empty-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### reports coverage with `resetModules`

```ts
test('reports coverage with `resetModules`', () => {
  const sourcemapDir = path.join(DIR, 'with-resetModules');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a CJS module is put under test without transformation

```ts
test('prints correct coverage report, if a CJS module is put under test without transformation', () => {
  const sourcemapDir = path.join(DIR, 'cjs-native-without-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a TS module is transpiled by Babel to CJS and put under test

```ts
test('prints correct coverage report, if a TS module is transpiled by Babel to CJS and put under test', () => {
  const sourcemapDir = path.join(DIR, 'cjs-with-babel-transformer');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if an ESM module is put under test without transformation

```ts
test('prints correct coverage report, if an ESM module is put under test without transformation', () => {
  const sourcemapDir = path.join(DIR, 'esm-native-without-sourcemap');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {
      nodeOptions: '--experimental-vm-modules --no-warnings',
      stripAnsi: true,
    },
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### prints correct coverage report, if a TS module is transpiled by custom transformer to ESM put under test

```ts
test('prints correct coverage report, if a TS module is transpiled by custom transformer to ESM put under test', () => {
  const sourcemapDir = path.join(DIR, 'esm-with-custom-transformer');

  const {stdout, exitCode} = runJest(
    sourcemapDir,
    ['--coverage', '--coverage-provider', 'v8', '--no-cache'],
    {
      nodeOptions: '--experimental-vm-modules --no-warnings',
      stripAnsi: true,
    },
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

#### vm script coverage generator

```ts
test('vm script coverage generator', () => {
  const dir = path.resolve(__dirname, '../vmscript-coverage');
  const {stdout, exitCode} = runJest(
    dir,
    ['--coverage', '--coverage-provider', 'v8'],
    {stripAnsi: true},
  );

  expect(exitCode).toBe(0);
  expect(stdout).toMatchSnapshot();
}
```

### ../../../../../.ctest/repos/f3c62de455-express/test/app.render.js

#### should support absolute paths

```ts
it('should support absolute paths', function(done){
      var app = createApp();

      app.locals.user = { name: 'tobi' };

      app.render(path.join(__dirname, 'fixtures', 'user.tmpl'), function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    }
```

#### should support absolute paths with "view engine"

```ts
it('should support absolute paths with "view engine"', function(done){
      var app = createApp();

      app.set('view engine', 'tmpl');
      app.locals.user = { name: 'tobi' };

      app.render(path.join(__dirname, 'fixtures', 'user'), function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    }
```

#### should expose app.locals

```ts
it('should expose app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.render('user.tmpl', function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    }
```

#### should support index.<engine>

```ts
it('should support index.<engine>', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.set('view engine', 'tmpl');

      app.render('blog/post', function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<h1>blog post</h1>')
        done();
      })
    }
```

#### should handle render error throws

```ts
it('should handle render error throws', function(done){
      var app = express();

      function View(name, options){
        this.name = name;
        this.path = 'fale';
      }

      View.prototype.render = function(options, fn){
        throw new Error('err!');
      };

      app.set('view', View);

      app.render('something', function(err, str){
        assert.ok(err)
        assert.strictEqual(err.message, 'err!')
        done();
      })
    }
```

#### should provide a helpful error

```ts
it('should provide a helpful error', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))
        app.render('rawr.tmpl', function (err) {
          assert.ok(err)
          assert.equal(err.message, 'Failed to lookup view "rawr.tmpl" in views directory "' + path.join(__dirname, 'fixtures') + '"')
          done();
        });
      }
```

#### should invoke the callback

```ts
it('should invoke the callback', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('user.tmpl', function (err) {
          assert.ok(err)
          assert.equal(err.name, 'RenderError')
          done()
        })
      }
```

#### should render the template

```ts
it('should render the template', function(done){
        var app = createApp();

        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>This is an email</p>')
          done();
        })
      }
```

#### should render the template

```ts
it('should render the template', function(done){
        var app = createApp();

        app.set('view engine', 'tmpl');
        app.set('views', path.join(__dirname, 'fixtures'))

        app.render('email', function(err, str){
          if (err) return done(err);
          assert.strictEqual(str, '<p>This is an email</p>')
          done();
        })
      }
```

#### should lookup the file in the path

```ts
it('should lookup the file in the path', function(done){
        var app = createApp();

        app.set('views',  path.join(__dirname, 'fixtures', 'default_layout'))
        app.locals.user = { name: 'tobi' };

        app.render('user.tmpl', function (err, str) {
          if (err) return done(err);
          assert.strictEqual(str, '<p>tobi</p>')
          done();
        })
      }
```

#### should lookup the file in the path

```ts
it('should lookup the file in the path', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.user = { name: 'tobi' };

          app.render('user.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<span>tobi</span>')
            done();
          })
        }
```

#### should lookup in later paths until found

```ts
it('should lookup in later paths until found', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.name = 'tobi';

          app.render('name.tmpl', function (err, str) {
            if (err) return done(err);
            assert.strictEqual(str, '<p>tobi</p>')
            done();
          })
        }
```

#### should error if file does not exist

```ts
it('should error if file does not exist', function(done){
          var app = createApp();
          var views = [
            path.join(__dirname, 'fixtures', 'local_layout'),
            path.join(__dirname, 'fixtures', 'default_layout')
          ]

          app.set('views', views);
          app.locals.name = 'tobi';

          app.render('pet.tmpl', function (err, str) {
            assert.ok(err)
            assert.equal(err.message, 'Failed to lookup view "pet.tmpl" in views directories "' + views[0] + '" or "' + views[1] + '"')
            done();
          })
        }
```

#### should create an instance of it

```ts
it('should create an instance of it', function(done){
        var app = express();

        function View(name, options){
          this.name = name;
          this.path = 'path is required by application.js as a signal of success even though it is not used there.';
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(str, 'abstract engine')
          done();
        })
      }
```

#### should always lookup view without cache

```ts
it('should always lookup view without cache', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', false);
        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 2)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      }
```

#### should cache with "view cache" setting

```ts
it('should cache with "view cache" setting', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', true);
        app.set('view', View);

        app.render('something', function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      }
```

#### should render the template

```ts
it('should render the template', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))

      var user = { name: 'tobi' };

      app.render('user.tmpl', { user: user }, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    }
```

#### should expose app.locals

```ts
it('should expose app.locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };

      app.render('user.tmpl', {}, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')
        done();
      })
    }
```

#### should give precedence to app.render() locals

```ts
it('should give precedence to app.render() locals', function(done){
      var app = createApp();

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' };
      var jane = { name: 'jane' };

      app.render('user.tmpl', { user: jane }, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>jane</p>')
        done();
      })
    }
```

#### should accept null or undefined options

```ts
it('should accept null or undefined options', function (done) {
      var app = createApp()

      app.set('views', path.join(__dirname, 'fixtures'))
      app.locals.user = { name: 'tobi' }

      app.render('user.tmpl', null, function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, '<p>tobi</p>')

        app.render('user.tmpl', undefined, function (err2, str2) {
          if (err2) return done(err2);
          assert.strictEqual(str2, '<p>tobi</p>')
          done()
        })
      })
    }
```

#### should cache with cache option

```ts
it('should cache with cache option', function(done){
        var app = express();
        var count = 0;

        function View(name, options){
          this.name = name;
          this.path = 'fake';
          count++;
        }

        View.prototype.render = function(options, fn){
          fn(null, 'abstract engine');
        };

        app.set('view cache', false);
        app.set('view', View);

        app.render('something', {cache: true}, function(err, str){
          if (err) return done(err);
          assert.strictEqual(count, 1)
          assert.strictEqual(str, 'abstract engine')
          app.render('something', {cache: true}, function(err, str){
            if (err) return done(err);
            assert.strictEqual(count, 1)
            assert.strictEqual(str, 'abstract engine')
            done();
          })
        })
      }
```

### ../../../../../.ctest/repos/95324de690-parser/packages/babel-core/test/path.js

#### replaceWithSourceString

```ts
it("replaceWithSourceString", function () {
    const expectCode = "function foo() {}";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            FunctionDeclaration: function (path) {
              path.replaceWithSourceString("console.whatever()");
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("console.whatever();");
  }
```

#### replaceWith (arrow expression body to block statement body)

```ts
it("replaceWith (arrow expression body to block statement body)", function () {
    const expectCode = "var fn = () => true;";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BlockStatement",
                body: [
                  {
                    type: "ReturnStatement",
                    argument: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => {\n  return true;\n};");
  }
```

#### replaceWith (arrow block statement body to expression body)

```ts
it("replaceWith (arrow block statement body to expression body)", function () {
    const expectCode = "var fn = () => { return true; }";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BooleanLiteral",
                value: true,
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => true;");
  }
```

#### replaceWith (for-in left expression to variable declaration)

```ts
it("replaceWith (for-in left expression to variable declaration)", function () {
    const expectCode = "for (KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY in right);");
  }
```

#### replaceWith (for-in left variable declaration to expression)

```ts
it("replaceWith (for-in left variable declaration to expression)", function () {
    const expectCode = "for (var KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY in right);");
  }
```

#### replaceWith (for-loop left expression to variable declaration)

```ts
it("replaceWith (for-loop left expression to variable declaration)", function () {
    const expectCode = "for (KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY;;);");
  }
```

#### replaceWith (for-loop left variable declaration to expression)

```ts
it("replaceWith (for-loop left variable declaration to expression)", function () {
    const expectCode = "for (var KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY;;);");
  }
```

### ../../../../../.ctest/repos/e7b1fff700-types/packages/babel-core/test/path.js

#### replaceWithSourceString

```ts
it("replaceWithSourceString", function () {
    const expectCode = "function foo() {}";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            FunctionDeclaration: function (path) {
              path.replaceWithSourceString("console.whatever()");
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("console.whatever();");
  }
```

#### replaceWith (arrow expression body to block statement body)

```ts
it("replaceWith (arrow expression body to block statement body)", function () {
    const expectCode = "var fn = () => true;";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BlockStatement",
                body: [
                  {
                    type: "ReturnStatement",
                    argument: {
                      type: "BooleanLiteral",
                      value: true,
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => {\n  return true;\n};");
  }
```

#### replaceWith (arrow block statement body to expression body)

```ts
it("replaceWith (arrow block statement body to expression body)", function () {
    const expectCode = "var fn = () => { return true; }";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ArrowFunctionExpression: function (path) {
              path.get("body").replaceWith({
                type: "BooleanLiteral",
                value: true,
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("var fn = () => true;");
  }
```

#### replaceWith (for-in left expression to variable declaration)

```ts
it("replaceWith (for-in left expression to variable declaration)", function () {
    const expectCode = "for (KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY in right);");
  }
```

#### replaceWith (for-in left variable declaration to expression)

```ts
it("replaceWith (for-in left variable declaration to expression)", function () {
    const expectCode = "for (var KEY in right);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForInStatement: function (path) {
              path.get("left").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY in right);");
  }
```

#### replaceWith (for-loop left expression to variable declaration)

```ts
it("replaceWith (for-loop left expression to variable declaration)", function () {
    const expectCode = "for (KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "VariableDeclaration",
                kind: "var",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "KEY",
                    },
                  },
                ],
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (var KEY;;);");
  }
```

#### replaceWith (for-loop left variable declaration to expression)

```ts
it("replaceWith (for-loop left variable declaration to expression)", function () {
    const expectCode = "for (var KEY;;);";

    const actualCode = transformSync(expectCode, {
      cwd,
      plugins: [
        new Plugin({
          visitor: {
            ForStatement: function (path) {
              path.get("init").replaceWith({
                type: "Identifier",
                name: "KEY",
              });
            },
          },
        }),
      ],
    }).code;

    expect(actualCode).toBe("for (KEY;;);");
  }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/e2e/__tests__/globalSetup.test.ts

#### globalSetup is triggered once before all test suites

```ts
test('globalSetup is triggered once before all test suites', () => {
  const setupPath = path.join(e2eDir, 'setup.js');
  const result = runWithJson(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(result.exitCode).toBe(0);
  const files = fs.readdirSync(DIR);
  expect(files).toHaveLength(1);
  const setup = fs.readFileSync(path.join(DIR, files[0]), 'utf8');
  expect(setup).toBe('setup');
}
```

#### jest throws an error when globalSetup does not export a function

```ts
test('jest throws an error when globalSetup does not export a function', () => {
  const setupPath = path.resolve(__dirname, '../global-setup/invalidSetup.js');
  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
}
```

#### globalSetup function gets global config object and project config as parameters

```ts
test('globalSetup function gets global config object and project config as parameters', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithConfig.js');

  const result = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### should call globalSetup function of multiple projects

```ts
test('should call globalSetup function of multiple projects', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [`--config=${configPath}`]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(true);
}
```

#### should not call a globalSetup of a project if there are no tests to run from this project

```ts
test('should not call a globalSetup of a project if there are no tests to run from this project', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    '--testPathPatterns=setup1',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(true);
  expect(fs.existsSync(project1DIR)).toBe(true);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### should not call any globalSetup if there are no tests to run

```ts
test('should not call any globalSetup if there are no tests to run', () => {
  const configPath = path.resolve(e2eDir, 'projects.jest.config.js');

  const result = runWithJson(e2eDir, [
    `--config=${configPath}`,
    // onlyChanged ensures there are no tests to run
    '--onlyChanged',
  ]);

  expect(result.exitCode).toBe(0);

  expect(fs.existsSync(DIR)).toBe(false);
  expect(fs.existsSync(project1DIR)).toBe(false);
  expect(fs.existsSync(project2DIR)).toBe(false);
}
```

#### globalSetup works with default export

```ts
test('globalSetup works with default export', () => {
  const setupPath = path.resolve(e2eDir, 'setupWithDefaultExport.js');

  const result = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=pass',
    '--cache=true',
  ]);

  expect(result.stdout).toBe("[ 'pass' ]\ntrue");
}
```

#### globalSetup throws with named export

```ts
test('globalSetup throws with named export', () => {
  const setupPath = path.resolve(e2eDir, 'invalidSetupWithNamedExport.js');

  const {exitCode, stderr} = runJest(e2eDir, [
    `--globalSetup=${setupPath}`,
    '--testPathPatterns=__tests__',
  ]);

  expect(exitCode).toBe(1);
  expect(stderr).toContain('Jest: Got error running globalSetup');
  expect(stderr).toContain(
    `globalSetup file must export a function at ${setupPath}`,
  );
}
```

### ../../../../../.ctest/repos/e7b1fff700-types/packages/babel-traverse/test/path/index.js

#### can set default value

```ts
it("can set default value", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", "test")).toBe("test");
    }
```

#### can set false

```ts
it("can set false", () => {
      const path = new NodePath({}, {});
      path.setData("foo", false);

      expect(path.getData("foo", true)).toBe(false);
    }
```

#### can set true

```ts
it("can set true", () => {
      const path = new NodePath({}, {});
      path.setData("foo", true);

      expect(path.getData("foo", false)).toBe(true);
    }
```

#### can set null

```ts
it("can set null", () => {
      const path = new NodePath({}, {});
      path.setData("foo", null);

      expect(path.getData("foo", true)).toBe(null);
    }
```

#### can use false as default

```ts
it("can use false as default", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", false)).toBe(false);
    }
```

#### does not use object base properties

```ts
it("does not use object base properties", () => {
      const path = new NodePath({}, {});

      expect(path.getData("__proto__", "test")).toBe("test");
    }
```

#### can use symbols as keys

```ts
it("can use symbols as keys", () => {
      const path = new NodePath({}, {});
      const symbol = Symbol("foo");
      path.setData(symbol, 42);

      expect(path.getData(symbol)).toBe(42);
    }
```

#### returns false if node is null

```ts
it("returns false if node is null", () => {
        const path = new NodePath({}, {});

        expect(path.hasNode()).toBe(false);
      }
```

#### returns true if node is not null

```ts
it("returns true if node is not null", () => {
        const path = new NodePath({}, {});
        path.node = {};

        expect(path.hasNode()).toBe(true);
      }
```

### ../../../../../.ctest/repos/95324de690-parser/packages/babel-traverse/test/path/index.js

#### can set default value

```ts
it("can set default value", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", "test")).toBe("test");
    }
```

#### can set false

```ts
it("can set false", () => {
      const path = new NodePath({}, {});
      path.setData("foo", false);

      expect(path.getData("foo", true)).toBe(false);
    }
```

#### can set true

```ts
it("can set true", () => {
      const path = new NodePath({}, {});
      path.setData("foo", true);

      expect(path.getData("foo", false)).toBe(true);
    }
```

#### can set null

```ts
it("can set null", () => {
      const path = new NodePath({}, {});
      path.setData("foo", null);

      expect(path.getData("foo", true)).toBe(null);
    }
```

#### can use false as default

```ts
it("can use false as default", () => {
      const path = new NodePath({}, {});

      expect(path.getData("foo", false)).toBe(false);
    }
```

#### does not use object base properties

```ts
it("does not use object base properties", () => {
      const path = new NodePath({}, {});

      expect(path.getData("__proto__", "test")).toBe("test");
    }
```

#### can use symbols as keys

```ts
it("can use symbols as keys", () => {
      const path = new NodePath({}, {});
      const symbol = Symbol("foo");
      path.setData(symbol, 42);

      expect(path.getData(symbol)).toBe(42);
    }
```

#### returns false if node is null

```ts
it("returns false if node is null", () => {
        const path = new NodePath({}, {});

        expect(path.hasNode()).toBe(false);
      }
```

#### returns true if node is not null

```ts
it("returns true if node is not null", () => {
        const path = new NodePath({}, {});
        path.node = {};

        expect(path.hasNode()).toBe(true);
      }
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/packages/jest-core/src/__tests__/SearchSource.test.ts

#### supports ../ paths and unix separators via testRegex

```ts
it('supports ../ paths and unix separators via testRegex', async () => {
      if (process.platform === 'win32') {
        return;
      }
      const {searchSource} = await initSearchSource({
        id,
        rootDir: '.',
        roots: [],
        testMatch: undefined,
        testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
      });

      const path = '/path/to/__tests__/foo/bar/baz/../../../test.js';
      expect(searchSource.isTestFilePath(path)).toBe(true);
    }
```

#### supports unix separators

```ts
it('supports unix separators', () => {
      if (process.platform !== 'win32') {
        const path = '/path/to/__tests__/test.js';
        expect(searchSource.isTestFilePath(path)).toBe(true);
      }
    }
```

#### supports win32 separators

```ts
it('supports win32 separators', () => {
      if (process.platform === 'win32') {
        const path = '\\path\\to\\__tests__\\test.js';
        expect(searchSource.isTestFilePath(path)).toBe(true);
      }
    }
```

#### finds tests matching a pattern via testRegex

```ts
it('finds tests matching a pattern via testRegex', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx', 'txt'],
        rootDir,
        testMatch: undefined,
        testRegex: 'not-really-a-test',
      });
      expect(paths).toEqual([
        path.normalize('.hiddenFolder/not-really-a-test.txt'),
        path.normalize('__testtests__/not-really-a-test.txt'),
      ]);
    }
```

#### finds tests matching a pattern via testMatch

```ts
it('finds tests matching a pattern via testMatch', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx', 'txt'],
        rootDir,
        testMatch: ['**/not-really-a-test.txt', '!**/do-not-match-me.txt'],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('.hiddenFolder/not-really-a-test.txt'),
        path.normalize('__testtests__/not-really-a-test.txt'),
      ]);
    }
```

#### finds tests matching a JS regex pattern

```ts
it('finds tests matching a JS regex pattern', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: undefined,
        testRegex: 'test.jsx?',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests matching a JS glob pattern

```ts
it('finds tests matching a JS glob pattern', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: ['**/test.js?(x)'],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests matching a JS with overriding glob patterns

```ts
it('finds tests matching a JS with overriding glob patterns', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch: [
          '**/*.js?(x)',
          '!**/test.js?(x)',
          '**/test.js',
          '!**/test.js',
        ],
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('module.jsx'),
        path.normalize('noTests.js'),
      ]);
    }
```

#### finds tests with default file extensions using testRegex

```ts
it('finds tests with default file extensions using testRegex', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch: undefined,
        testRegex,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with default file extensions using testMatch

```ts
it('finds tests with default file extensions using testMatch', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch,
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with parentheses in their rootDir when using testMatch

```ts
it('finds tests with parentheses in their rootDir when using testMatch', async () => {
      const paths = await getTestPaths({
        id,
        rootDir: path.resolve(__dirname, 'test_root_with_(parentheses)'),
        testMatch: ['<rootDir>**/__testtests__/**/*'],
        testRegex: undefined,
      });
      expect(paths).toEqual([
        expect.stringContaining(path.normalize('__testtests__/test.js')),
      ]);
    }
```

#### finds tests with similar but custom file extensions

```ts
it('finds tests with similar but custom file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests with totally custom foobar file extensions

```ts
it('finds tests with totally custom foobar file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'foobar'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.foobar'),
        path.normalize('__testtests__/test.js'),
      ]);
    }
```

#### finds tests with many kinds of file extensions

```ts
it('finds tests with many kinds of file extensions', async () => {
      const paths = await getTestPaths({
        id,
        moduleFileExtensions: ['js', 'jsx'],
        rootDir,
        testMatch,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests using a regex only

```ts
it('finds tests using a regex only', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch: undefined,
        testRegex,
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### finds tests using a glob only

```ts
it('finds tests using a glob only', async () => {
      const paths = await getTestPaths({
        id,
        rootDir,
        testMatch,
        testRegex: '',
      });
      expect(paths).toEqual([
        path.normalize('__testtests__/test.js'),
        path.normalize('__testtests__/test.jsx'),
      ]);
    }
```

#### filter tests based on an optional filter method

```ts
it('filter tests based on an optional filter method', async () => {
      const filterFunction = (testPaths: Array<string>) =>
        Promise.resolve({
          filtered: testPaths.filter(testPath => testPath.includes('test.jsx')),
        });
      const paths = await getTestPaths(
        {
          id,
          rootDir,
        },
        filterFunction,
      );

      expect(paths).toHaveLength(1);
      expect(paths[0]).toStrictEqual(path.normalize('__testtests__/test.jsx'));
    }
```

#### should allow a simple match

```ts
it('should allow a simple match', async () => {
      const result = searchSource.filterPathsWin32(['packages/lib/my-lib.ts']);
      expect(result).toEqual([path.resolve('packages/lib/my-lib.ts')]);
    }
```

#### should allow to match a file inside a hidden directory

```ts
it('should allow to match a file inside a hidden directory', async () => {
      const result = searchSource.filterPathsWin32([
        'packages/.hidden/my-app-hidden.ts',
      ]);
      expect(result).toEqual([
        path.resolve('packages/.hidden/my-app-hidden.ts'),
      ]);
    }
```

#### should allow to match a file inside a directory prefixed with a "@"

```ts
it('should allow to match a file inside a directory prefixed with a "@"', async () => {
      const result = searchSource.filterPathsWin32([
        'packages/@core/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow to match a file inside a directory prefixed with a "+"

```ts
it('should allow to match a file inside a directory prefixed with a "+"', async () => {
      const result = searchSource.filterPathsWin32(['packages/+cli/my-cli.ts']);
      expect(result).toEqual([path.resolve('packages/+cli/my-cli.ts')]);
    }
```

#### should allow an @(pattern)

```ts
it('should allow an @(pattern)', () => {
      const result = searchSource.filterPathsWin32([
        'packages/@(@core)/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow a +(pattern)

```ts
it('should allow a +(pattern)', () => {
      const result = searchSource.filterPathsWin32([
        'packages/+(@core)/my-app.ts',
      ]);
      expect(result).toEqual([path.resolve('packages/@core/my-app.ts')]);
    }
```

#### should allow for (pattern) in file path

```ts
it('should allow for (pattern) in file path', () => {
      const result = searchSource.filterPathsWin32([
        'packages/programs (x86)/my-program.ts',
      ]);
      expect(result).toEqual([
        path.resolve('packages/programs (x86)/my-program.ts'),
      ]);
    }
```

#### should allow no results found

```ts
it('should allow no results found', () => {
      const result = searchSource.filterPathsWin32(['not/exists']);
      expect(result).toHaveLength(0);
    }
```

#### makes sure a file is related to itself

```ts
it('makes sure a file is related to itself', async () => {
      const data = await searchSource.findRelatedTests(
        new Set([rootPath]),
        false,
      );
      expect(toPaths(data.tests)).toEqual([rootPath]);
    }
```

#### finds tests that depend directly on the path

```ts
it('finds tests that depend directly on the path', async () => {
      const filePath = path.join(rootDir, 'RegularModule.js');
      const file2Path = path.join(rootDir, 'RequireRegularModule.js');
      const parentDep = path.join(rootDir, 'ModuleWithSideEffects.js');
      const data = await searchSource.findRelatedTests(
        new Set([filePath]),
        false,
      );
      expect(toPaths(data.tests).sort()).toEqual([
        parentDep,
        filePath,
        file2Path,
        rootPath,
      ]);
    }
```

#### excludes untested files from coverage

```ts
it('excludes untested files from coverage', async () => {
      const unrelatedFile = path.join(rootDir, 'JSONFile.json');
      const regular = path.join(rootDir, 'RegularModule.js');
      const requireRegular = path.join(rootDir, 'RequireRegularMode.js');

      const data = await searchSource.findRelatedTests(
        new Set([regular, requireRegular, unrelatedFile]),
        true,
      );
      expect([...(data.collectCoverageFrom || [])]).toEqual([
        'RegularModule.js',
      ]);
    }
```

#### finds tests for a single file

```ts
it('finds tests for a single file', async () => {
      const input = ['packages/jest-core/src/__tests__/test_root/module.jsx'];
      const data = await searchSource.findRelatedTestsFromPattern(input, false);
      expect(toPaths(data.tests).sort()).toEqual([
        path.join(rootDir, '__testtests__', 'test.js'),
        path.join(rootDir, '__testtests__', 'test.jsx'),
      ]);
    }
```

#### finds tests for multiple files

```ts
it('finds tests for multiple files', async () => {
      const input = [
        'packages/jest-core/src/__tests__/test_root/module.jsx',
        'packages/jest-core/src/__tests__/test_root/module.foobar',
      ];
      const data = await searchSource.findRelatedTestsFromPattern(input, false);
      expect(toPaths(data.tests).sort()).toEqual([
        path.join(rootDir, '__testtests__', 'test.foobar'),
        path.join(rootDir, '__testtests__', 'test.js'),
        path.join(rootDir, '__testtests__', 'test.jsx'),
      ]);
    }
```

#### does not mistake roots folders with prefix names

```ts
it('does not mistake roots folders with prefix names', async () => {
      if (process.platform === 'win32') {
        return;
      }
      ({searchSource} = await initSearchSource({
        id,
        rootDir: '.',
        roots: ['/foo/bar/prefix'],
      }));

      const input = ['/foo/bar/prefix-suffix/__tests__/my-test.test.js'];
      const data = searchSource.findTestsByPaths(input);
      expect(data.tests).toEqual([]);
    }
```

#### return empty set if no SCM

```ts
it('return empty set if no SCM', async () => {
      const requireRegularModule = path.join(
        rootDir,
        'RequireRegularModule.js',
      );
      const sources =
        await searchSource.findRelatedSourcesFromTestsInChangedFiles({
          changedFiles: new Set([requireRegularModule]),
          repos: {
            git: new Set(),
            hg: new Set(),
          },
        });
      expect(sources).toEqual([]);
    }
```

#### return sources required by tests

```ts
it('return sources required by tests', async () => {
      const regularModule = path.join(rootDir, 'RegularModule.js');
      const requireRegularModule = path.join(
        rootDir,
        'RequireRegularModule.js',
      );
      const sources =
        await searchSource.findRelatedSourcesFromTestsInChangedFiles({
          changedFiles: new Set([requireRegularModule]),
          repos: {
            git: new Set('/path/to/git'),
            hg: new Set(),
          },
        });
      expect(sources).toEqual([regularModule]);
    }
```

### ../../../../../.ctest/repos/f3c62de455-express/test/req.path.js

#### should return the parsed pathname

```ts
it('should return the parsed pathname', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.path);
      });

      request(app)
      .get('/login?redirect=/post/1/comments')
      .expect('/login', done);
    }
```

## fs

**Consultas usadas no Horsebox:** `readFile`, `fs readFile`

**Arquivos de teste encontrados:** 153

### ../../../../../.ctest/repos/14fdeea7a0-jest/e2e/__tests__/toMatchInlineSnapshot.test.ts

#### basic support

```ts
test('basic support', () => {
  const filename = 'basic-support.test.js';
  const template = makeTemplate(
    "test('inline snapshots', () => expect($1).toMatchInlineSnapshot());\n",
  );

  {
    writeFiles(TESTS_DIR, {
      [filename]: template(['{apple: "original value"}']),
    });
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('initial write');
  }

  {
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 passed, 1 total');
    expect(stderr).not.toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('snapshot passed');
  }

  {
    writeFiles(TESTS_DIR, {
      [filename]: readFile(filename).replace('original value', 'updated value'),
    });
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshot name: `inline snapshots 1`');
    expect(exitCode).toBe(1);
    expect(fileAfter).toMatchSnapshot('snapshot mismatch');
  }

  {
    const {stderr, exitCode} = runJest(DIR, [
      '-w=1',
      '--ci=false',
      filename,
      '-u',
    ]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot updated from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('snapshot updated');
  }
}
```

#### do not indent empty lines

```ts
test('do not indent empty lines', () => {
  const filename = 'empty-line-indent.test.js';
  const template = makeTemplate(
    "test('inline snapshots', () => expect($1).toMatchInlineSnapshot());\n",
  );

  {
    writeFiles(TESTS_DIR, {
      [filename]: template(['`hello\n\nworld`']),
    });
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('initial write');
  }

  {
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 passed, 1 total');
    expect(stderr).not.toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('snapshot passed');
  }
}
```

#### handles property matchers

```ts
test('handles property matchers', () => {
  const filename = 'handle-property-matchers.test.js';
  const template = makeTemplate(`test('handles property matchers', () => {
      expect({createdAt: $1}).toMatchInlineSnapshot({createdAt: expect.any(Date)});
    });
    `);

  {
    writeFiles(TESTS_DIR, {[filename]: template(['new Date()'])});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('initial write');
  }

  {
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 passed, 1 total');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('snapshot passed');
  }

  {
    writeFiles(TESTS_DIR, {
      [filename]: readFile(filename).replace('new Date()', '"string"'),
    });
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshot name: `handles property matchers 1`');
    expect(stderr).toMatch('Snapshots:   1 failed, 1 total');
    expect(exitCode).toBe(1);
    expect(fileAfter).toMatchSnapshot('snapshot failed');
  }

  {
    writeFiles(TESTS_DIR, {
      [filename]: readFile(filename).replace('any(Date)', 'any(String)'),
    });
    const {stderr, exitCode} = runJest(DIR, [
      '-w=1',
      '--ci=false',
      filename,
      '-u',
    ]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot updated from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('snapshot updated');
  }
}
```

#### removes obsolete external snapshots

```ts
test('removes obsolete external snapshots', () => {
  const filename = 'removes-obsolete-external-snapshots.test.js';
  const snapshotPath = path.join(
    TESTS_DIR,
    '__snapshots__',
    `${filename}.snap`,
  );
  const template = makeTemplate(`
    test('removes obsolete external snapshots', () => {
      expect('1').$1();
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template(['toMatchSnapshot'])});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('initial write');
    expect(fs.existsSync(snapshotPath)).toBe(true);
  }

  {
    writeFiles(TESTS_DIR, {[filename]: template(['toMatchInlineSnapshot'])});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 obsolete, 1 written, 1 total');
    expect(exitCode).toBe(1);
    expect(fileAfter).toMatchSnapshot('inline snapshot written');
    expect(fs.existsSync(snapshotPath)).toBe(true);
  }

  {
    const {stderr, exitCode} = runJest(DIR, [
      '-w=1',
      '--ci=false',
      filename,
      '-u',
    ]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('Snapshots:   1 file removed, 1 passed, 1 total');
    expect(exitCode).toBe(0);
    expect(fileAfter).toMatchSnapshot('external snapshot cleaned');
    expect(fs.existsSync(snapshotPath)).toBe(false);
  }
}
```

#### supports async matchers

```ts
test('supports async matchers', () => {
  const filename = 'async-matchers.test.js';
  const test = `
    test('inline snapshots', async () => {
      expect(Promise.resolve('success')).resolves.toMatchInlineSnapshot();
      expect(Promise.reject('fail')).rejects.toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('2 snapshots written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot();
}
```

#### supports async tests

```ts
test('supports async tests', () => {
  const filename = 'async.test.js';
  const test = `
    test('inline snapshots', async () => {
      await 'next tick';
      expect(42).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot();
}
```

#### writes snapshots with non-literals in expect(...)

```ts
test('writes snapshots with non-literals in expect(...)', () => {
  const filename = 'async.test.js';
  const test = `
    it('works with inline snapshots', () => {
      expect({a: 1}).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);

  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot();
}
```

#### handles mocking native modules prettier relies on

```ts
test('handles mocking native modules prettier relies on', () => {
  const filename = 'mockFail.test.js';
  const test = `
    jest.mock('path', () => ({}));
    jest.mock('fs', () => ({}));
    jest.mock('graceful-fs', () => ({}));
    test('inline snapshots', () => {
      expect({}).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
}
```

#### supports custom matchers

```ts
test('supports custom matchers', () => {
  const filename = 'custom-matchers.test.js';
  const test = `
    const { toMatchInlineSnapshot } = require('jest-snapshot');
    expect.extend({
      toMatchCustomInlineSnapshot(received, ...args) {
        return toMatchInlineSnapshot.call(this, received, ...args);
      }
    });
    test('inline snapshots', () => {
      expect({apple: "original value"}).toMatchCustomInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot('custom matchers');
}
```

#### supports custom matchers with property matcher

```ts
test('supports custom matchers with property matcher', () => {
  const filename = 'custom-matchers-with-property-matcher.test.js';
  const test = `
    const { toMatchInlineSnapshot } = require('jest-snapshot');
    expect.extend({
      toMatchCustomInlineSnapshot(received, ...args) {
        return toMatchInlineSnapshot.call(this, received, ...args);
      },
      toMatchUserInlineSnapshot(received, ...args) {
        return toMatchInlineSnapshot.call(
          this,
          received,
          {
            createdAt: expect.any(Date),
            id: expect.any(Number),
          },
          ...args
        );
      },
    });
    test('inline snapshots', () => {
      const user = {
        createdAt: new Date(),
        id: Math.floor(Math.random() * 20),
        name: 'LeBron James',
      };
      expect(user).toMatchCustomInlineSnapshot({
        createdAt: expect.any(Date),
        id: expect.any(Number),
      });
      expect(user).toMatchUserInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('2 snapshots written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot('custom matchers with property matcher');
}
```

#### multiple custom matchers and native matchers

```ts
test('multiple custom matchers and native matchers', () => {
  const filename = 'multiple-matchers.test.js';
  const test = `
    const { toMatchInlineSnapshot } = require('jest-snapshot');
    expect.extend({
      toMatchCustomInlineSnapshot(received, ...args) {
        return toMatchInlineSnapshot.call(this, received, ...args);
      },
      toMatchCustomInlineSnapshot2(received, ...args) {
        return toMatchInlineSnapshot.call(this, received, ...args);
      },
    });
    test('inline snapshots', () => {
      expect({apple: "value 1"}).toMatchCustomInlineSnapshot();
      expect({apple: "value 2"}).toMatchInlineSnapshot();
      expect({apple: "value 3"}).toMatchCustomInlineSnapshot2();
      expect({apple: "value 4"}).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('4 snapshots written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot('multiple matchers');
}
```

#### indentation is correct in the presences of existing snapshots

```ts
test('indentation is correct in the presences of existing snapshots', () => {
  const filename = 'existing-snapshot.test.js';
  const test = `
    test('existing snapshot', () => {
      expect({ hello: 'world' }).toMatchInlineSnapshot(\`
        {
          "hello": "world",
        }
      \`);
      expect({ hello: 'world' }).toMatchInlineSnapshot();
    });
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot('existing snapshot');
}
```

#### indentation is correct in the presences of existing snapshots, when the file is correctly formatted by prettier

```ts
test('indentation is correct in the presences of existing snapshots, when the file is correctly formatted by prettier', () => {
  const filename = 'existing-snapshot.test.js';
  const test = `
    it('is true', () => {
      expect(true).toMatchInlineSnapshot(\`true\`);
      expect([1, 2, 3]).toMatchInlineSnapshot();
    });\\n
  `;

  writeFiles(TESTS_DIR, {[filename]: test});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(exitCode).toBe(0);
  expect(fileAfter).toMatchSnapshot('existing snapshot');
}
```

### ../../../../../.ctest/repos/14fdeea7a0-jest/e2e/__tests__/toThrowErrorMatchingInlineSnapshot.test.ts

#### works fine when function throws error

```ts
test('works fine when function throws error', () => {
  const filename = 'works-fine-when-function-throws-error.test.js';
  const template = makeTemplate(`
    test('works fine when function throws error', () => {
      expect(() => {
        throw new Error('apple');
      })
        .toThrowErrorMatchingInlineSnapshot();
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template()});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(fileAfter).toMatchSnapshot('initial write');
    expect(exitCode).toBe(0);
  }
}
```

#### works fine when function throws error with cause

```ts
test('works fine when function throws error with cause', () => {
  const filename = 'works-fine-when-function-throws-error-with-cause.test.js';
  const template = makeTemplate(`
    test('works fine when function throws error', () => {
      function ErrorWithCause(message, cause) {
        const err = new Error(message, {cause});
        if (err.cause !== cause) {
          // cause does not exist in old versions of node
          err.cause = cause;
        }
        return err;
      }
      expect(() => {
        throw ErrorWithCause('apple',
          ErrorWithCause('banana',
            ErrorWithCause('orange')
          )
        );
      })
        .toThrowErrorMatchingInlineSnapshot();
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template()});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(fileAfter).toMatchSnapshot('initial write with cause');
    expect(exitCode).toBe(0);
  }
}
```

#### works fine when function throws error with string cause

```ts
test('works fine when function throws error with string cause', () => {
  const filename =
    'works-fine-when-function-throws-error-with-string-cause.test.js';
  const template = makeTemplate(`
    test('works fine when function throws error', () => {
      function ErrorWithCause(message, cause) {
        const err = new Error(message, {cause});
        if (err.cause !== cause) {
          // cause does not exist in old versions of node
          err.cause = cause;
        }
        return err;
      }
      expect(() => {
        throw ErrorWithCause('apple', 'here is a cause');
      })
        .toThrowErrorMatchingInlineSnapshot();
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template()});
    const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot written from 1 test suite.');
    expect(fileAfter).toMatchSnapshot('initial write with cause');
    expect(exitCode).toBe(0);
  }
}
```

#### updates existing snapshot

```ts
test('updates existing snapshot', () => {
  const filename = 'updates-existing-snapshot.test.js';
  const template = makeTemplate(`
    test('updates existing snapshot', () => {
      expect(() => {
        throw new Error('apple');
      })
        .toThrowErrorMatchingInlineSnapshot(\`"banana"\`);
    });
  `);

  {
    writeFiles(TESTS_DIR, {[filename]: template()});
    const {stderr, exitCode} = runJest(DIR, [
      '-w=1',
      '--ci=false',
      filename,
      '-u',
    ]);
    const fileAfter = readFile(filename);
    expect(stderr).toMatch('1 snapshot updated from 1 test suite.');
    expect(fileAfter).toMatchSnapshot('updated snapshot');
    expect(exitCode).toBe(0);
  }
}
```

#### should support rejecting promises

```ts
test('should support rejecting promises', () => {
  const filename = 'should-support-rejecting-promises.test.js';
  const template = makeTemplate(`
    test('should support rejecting promises', async () => {
      await expect(Promise.reject(new Error('octopus')))
        .rejects.toThrowErrorMatchingInlineSnapshot();
    });
  `);

  writeFiles(TESTS_DIR, {[filename]: template()});
  const {stderr, exitCode} = runJest(DIR, ['-w=1', '--ci=false', filename]);
  const fileAfter = readFile(filename);
  expect(stderr).toMatch('1 snapshot written from 1 test suite.');
  expect(fileAfter).toMatchSnapshot();
  expect(exitCode).toBe(0);
}
```

