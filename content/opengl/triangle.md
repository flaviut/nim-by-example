---
title: OpenGL: Triangle
---
# OpenGL: Triangle

The following code depends on the ``opengl`` and ``nim-glfw`` packages which
can be installed via babel by executing ``babel install opengl@#head nim-glfw@#head``.
You will need the GLFW DLL in order to run this on Windows.

![Triangle Windows](https://nimrod-by-example.github.io/images/triangle.png)

One thing to keep in mind when writing OpenGL code in Nimrod is that ``float``
is actually ``float64``. But vertices must be ``float32`` so you must explicitly
specify that by casting or using ``'f32`` as is done in the example.

```nimrod
import os, glfw/glfw, opengl, times, math

proc assertShader(shader: GLuint) =
  var status: GLint
  glGetShaderiv(shader, GL_COMPILE_STATUS, addr status)
  if status != GL_TRUE:
    var buff: array[512, char]
    glGetShaderInfoLog(shader, 512, nil, buff)
    echo(buff)
    assert false

const 
  vertexSource = """
#version 150

in vec2 position;
in vec3 color;

out vec3 Color;

void main()
{
    Color = color;
    gl_Position = vec4(position, 0.0, 1.0);
}
"""
  fragmentSource = """
#version 150

in vec3 Color;

out vec4 outColor;

void main()
{
    outColor = vec4(Color, 1.0);
}
"""


proc setup(shaderProgram: var TGLUint) =
  var vertices = [
     0.0'f32, 0.5, 1, 0, 0,
     0.5,    -0.5, 0, 1, 0,
    -0.5,    -0.5, 0, 0, 1
  ]
  echo(vertices.repr)
  var vertexBuffer: GLuint
  glGenBuffers(1, addr vertexBuffer)
  echo("Verter Buff: ", vertexBuffer)

  var vertexArray: GLuint
  glGenVertexArrays(1, addr vertexArray)
  glBindVertexArray(vertexArray)
  

  glBindBuffer(GL_ARRAY_BUFFER, vertexBuffer)
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices).int32, addr vertices,
               GL_STATIC_DRAW)

  var vertexShader = glCreateShader(GL_VERTEX_SHADER)
  var vertexSrcArray = [vertexSource.cstring]
  glShaderSource(vertexShader, 1, cast[cstringArray](addr vertexSrcArray), nil)
  glCompileShader(vertexShader)
  assertShader(vertexShader)

  var fragmentShader = glCreateShader(GL_FRAGMENT_SHADER)
  var fragmentSrcArray = [fragmentSource.cstring]
  glShaderSource(fragmentShader, 1, cast[cstringArray](addr fragmentSrcArray),
      nil)
  glCompileShader(fragmentShader)
  assertShader(fragmentShader)

  shaderProgram = glCreateProgram()
  glAttachShader(shaderProgram, vertexShader)
  glAttachShader(shaderProgram, fragmentShader)

  # Apparently this is not necessary according to http://open.gl
  glBindFragDataLocation(shaderProgram, 0, "outColor")

  glLinkProgram(shaderProgram)
  glUseProgram(shaderProgram)

  # Vertex data <-> attributes
  var posAttrib = glGetAttribLocation(shaderProgram, "position").gluint
  glEnableVertexAttribArray(posAttrib)
  glVertexAttribPointer(posAttrib, 2, cGL_FLOAT, false,
                        5*sizeof(GLFloat).int32, nil)

  var colAttrib = glGetAttribLocation(shaderProgram, "color").gluint
  glEnableVertexAttribArray(colAttrib)
  glVertexAttribPointer(colAttrib, 3, cGL_FLOAT, false,
                        5*sizeof(GLFloat).int32,
                        cast[pointer](2*sizeof(GLFloat)))

when isMainModule:
  glfw.init()
  var win = newWin()
  win.makeContextCurrent()

  loadExtensions()

  var shaderProgram: TGLuint
  setup(shaderProgram)

  while not win.shouldClose:
    glClear(GL_COLOR_BUFFER_BIT or GL_DEPTH_BUFFER_BIT)

    glDrawArrays(GL_TRIANGLES, 0, 3)
    win.swapBufs()
    
    pollEvents()

  win.destroy()
  glfw.terminate()
```
