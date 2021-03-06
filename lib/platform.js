module.exports = function (width, height) {
  width = width || window.innerWidth;
  height = height || window.innerHeight;

  document.body.textContent = "";
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  document.body.appendChild(canvas);
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  var raf = window.requestAnimationFrame || function(callback) { setTimeout(callback, 10); }

  var platform = {
    type: "browserDom",
    loadTexture: loadTexture,
    setTitle: setTitle,
    setIcon: setIcon,
    width: width,
    height: height,
    flip: function () {},
    requestAnimationFrame: raf,
    on: function (name, callback) {
      window.addEventListener(name, callback, true);
    },
    gl: gl
  };

  return platform;

  function loadTexture(path, callback) {
    var img = new Image;
    img.onload = function () {
      try {
        var gltexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, gltexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      catch(e) {
        return callback(e);
      }
      callback(null, gltexture);
    }
    img.onerror = function (err) {
      callback(new Error("Cannot load image " + JSON.stringify(path)));
    }
    img.src = path;
  }

  function setTitle(title) {
    document.title = title;
  }

  function setIcon(path) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = path;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  }

};

