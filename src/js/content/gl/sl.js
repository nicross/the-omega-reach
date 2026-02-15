content.gl.sl = {}

// Common stuff
content.gl.sl.common = () => `
${content.gl.sl.definePi()}
${content.gl.sl.circle()}
${content.gl.sl.hash()}
${content.gl.sl.hsv2rgb()}
${content.gl.sl.rand()}
${content.gl.sl.rotate()}
${content.gl.sl.scale()}
${content.gl.sl.perlin2d()}
${content.gl.sl.perlin3d()}
${content.gl.sl.perlin4d()}
`

content.gl.sl.commonFragment = () => `
${content.gl.sl.common()}
${content.gl.sl.getRelativeFromFragCoord()}
`

content.gl.sl.commonVertex = () => `
${content.gl.sl.common()}
`

content.gl.sl.attributeNames = () => [
  'quadCoordinates_in',
]

content.gl.sl.bindUniforms = (gl, program) => {
  const drawDistance = content.gl.drawDistance()

  // Bind quadCoordinates_in
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    content.gl.quadTextureCoordinates()
  ), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(program.attributes.quadCoordinates_in)
  gl.vertexAttribPointer(program.attributes.quadCoordinates_in, 2, gl.FLOAT, false, 0, 0)

  // Bind u_camera
  const camera = content.camera.vector()
  gl.uniform3fv(program.uniforms.u_camera, [camera.x, camera.y, camera.z])

  // Bind u_drawDistance
  gl.uniform1f(program.uniforms.u_drawDistance, drawDistance)

  // Bind u_projection
  gl.uniformMatrix4fv(program.uniforms.u_projection, false, content.camera.projectionMatrix().elements)

  // Bind u_proximity
  gl.uniform1f(program.uniforms.u_proximity, Math.max(app.screen.game.interact.proximity(), app.screen.game.interact.value()))

  // Bind u_resolution
  gl.uniform2fv(program.uniforms.u_resolution, [gl.canvas.width, gl.canvas.height])

  // Bind u_solution
  const solution = content.solution.get()
  gl.uniform3fv(program.uniforms.u_solution, [solution?.x || 0, solution?.y || 0, solution?.z || 0])

  // Bind u_time
  gl.uniform1f(program.uniforms.u_time, content.time.value())
}

content.gl.sl.defineIns = () => `
in vec3 camera;
in float drawDistance;
in mat4 projection;
in mat4 projection_inverse;
in highp float proximity;
in vec2 quadCoordinates;
in vec2 resolution;
in vec3 solution;
in highp float time;
`

content.gl.sl.defineOuts = () => `
out vec3 camera;
out float drawDistance;
out mat4 projection;
out mat4 projection_inverse;
out vec2 quadCoordinates;
out float proximity;
out vec2 resolution;
out vec3 solution;
out float time;
`

content.gl.sl.defineUniforms = () => `
in vec2 quadCoordinates_in;
uniform vec3 u_camera;
uniform float u_drawDistance;
uniform highp float u_proximity;
uniform mat4 u_projection;
uniform vec2 u_resolution;
uniform vec3 u_solution;
uniform highp float u_time;
`

content.gl.sl.passUniforms = () => `
camera = u_camera;
drawDistance = u_drawDistance;
projection = u_projection;
projection_inverse = inverse(u_projection);
proximity = u_proximity;
quadCoordinates = quadCoordinates_in;
resolution = u_resolution;
solution = u_solution;
time = u_time;
`

content.gl.sl.uniformNames = () => [
  'u_camera',
  'u_planet',
  'u_projection',
  'u_proximity',
  'u_resolution',
  'u_solution',
  'u_time',
]

// Invididual functions
content.gl.sl.circle = () => `
// https://webgl2fundamentals.org/webgl/webgl-qna-the-fastest-way-to-draw-many-circles-example-5.html
float circle(vec2 st, float radius) {
  vec2 dist = st - vec2(0.5);

  return 1.0 - smoothstep(
     0.0,
     radius,
     dot(dist, dist) * 4.0
  );
}
`

content.gl.sl.definePi = () => `
#define PI 3.1415926535897932384626433832795
`

content.gl.sl.getRelativeFromFragCoord = () => `
vec3 getRelativeFromFragCoord() {
  // Convert screen space to world space coordinates
  // https://stackoverflow.com/a/38960050
  vec4 ndc = vec4(
    ((gl_FragCoord.x / resolution.x) - 0.5) * 2.0,
    ((gl_FragCoord.y / resolution.y) - 0.5) * 2.0,
    (gl_FragCoord.z  - 0.5) * 2.0,
    1.0
  );

  // Convert world space to clip space
  vec4 clip = projection_inverse * ndc;

  // Normalize it
  return normalize((clip / clip.w).xyz);
}
`

content.gl.sl.hash = () => `
float hash(float x) {
  int i = int(x);

  i += (i << 10);
  i ^= (i >> 6);
  i += (i << 3);
  i ^= (i >> 11);
  i += (i << 15);

  return float(i);
}

float hash (vec2 v) {
  return hash(float(int(v.x) ^ int(hash(v.y))));
}

float hash (vec3 v) {
  return hash(float(int(v.x) ^ int(hash(v.yz))));
}

float hash (vec4 v) {
  return hash(float(int(v.x) ^ int(hash(v.yzw))));
}
`

content.gl.sl.hsv2rgb = () => `
// Function from Iñigo Quiles
// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(
    abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
    0.0,
    1.0
  );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}
`

content.gl.sl.perlin2d = () => `
float perlin2d(vec2 v, float seed) {
  float x0 = floor(v.x);
  float x1 = x0 + 1.0;
  float dx = smoothstep(0.0, 1.0, v.x - x0);

  float y0 = floor(v.y);
  float y1 = y0 + 1.0;
  float dy = smoothstep(0.0, 1.0, v.y - y0);

  return mix(
    mix(
      rand(vec2(hash(vec2(x0, y0)), seed)),
      rand(vec2(hash(vec2(x1, y0)), seed)),
      dx
    ),
    mix(
      rand(vec2(hash(vec2(x0, y1)), seed)),
      rand(vec2(hash(vec2(x1, y1)), seed)),
      dx
    ),
    dy
  );
}
`

content.gl.sl.perlin3d = () => `
float perlin3d(vec3 v, float seed) {
  float x0 = floor(v.x);
  float x1 = x0 + 1.0;
  float dx = v.x - x0;

  float y0 = floor(v.y);
  float y1 = y0 + 1.0;
  float dy = v.y - y0;

  float z0 = floor(v.z);
  float z1 = z0 + 1.0;
  float dz = v.z - z0;

  return mix(
    mix(
      mix(
        rand(vec2(hash(vec3(x0, y0, z0)), seed)),
        rand(vec2(hash(vec3(x1, y0, z0)), seed)),
        dx
      ),
      mix(
        rand(vec2(hash(vec3(x0, y1, z0)), seed)),
        rand(vec2(hash(vec3(x1, y1, z0)), seed)),
        dx
      ),
      dy
    ),
    mix(
      mix(
        rand(vec2(hash(vec3(x0, y0, z1)), seed)),
        rand(vec2(hash(vec3(x1, y0, z1)), seed)),
        dx
      ),
      mix(
        rand(vec2(hash(vec3(x0, y1, z1)), seed)),
        rand(vec2(hash(vec3(x1, y1, z1)), seed)),
        dx
      ),
      dy
    ),
    dz
  );
}
`

content.gl.sl.perlin4d = () => `
float perlin4d(vec4 v, float seed) {
  float x0 = floor(v.x);
  float x1 = x0 + 1.0;
  float dx = v.x - x0;

  float y0 = floor(v.y);
  float y1 = y0 + 1.0;
  float dy = v.y - y0;

  float z0 = floor(v.z);
  float z1 = z0 + 1.0;
  float dz = v.z - z0;

  float w0 = floor(v.w);
  float w1 = w0 + 1.0;
  float dw = v.w - w0;

  return mix(
    mix(
      mix(
        mix(
          rand(vec2(hash(vec4(x0, y0, z0, w0)), seed)),
          rand(vec2(hash(vec4(x1, y0, z0, w0)), seed)),
          dx
        ),
        mix(
          rand(vec2(hash(vec4(x0, y1, z0, w0)), seed)),
          rand(vec2(hash(vec4(x1, y1, z0, w0)), seed)),
          dx
        ),
        dy
      ),
      mix(
        mix(
          rand(vec2(hash(vec4(x0, y0, z1, w0)), seed)),
          rand(vec2(hash(vec4(x1, y0, z1, w0)), seed)),
          dx
        ),
        mix(
          rand(vec2(hash(vec4(x0, y1, z1, w0)), seed)),
          rand(vec2(hash(vec4(x1, y1, z1, w0)), seed)),
          dx
        ),
        dy
      ),
      dz
    ),
    mix(
      mix(
        mix(
          rand(vec2(hash(vec4(x0, y0, z0, w1)), seed)),
          rand(vec2(hash(vec4(x1, y0, z0, w1)), seed)),
          dx
        ),
        mix(
          rand(vec2(hash(vec4(x0, y1, z0, w1)), seed)),
          rand(vec2(hash(vec4(x1, y1, z0, w1)), seed)),
          dx
        ),
        dy
      ),
      mix(
        mix(
          rand(vec2(hash(vec4(x0, y0, z1, w1)), seed)),
          rand(vec2(hash(vec4(x1, y0, z1, w1)), seed)),
          dx
        ),
        mix(
          rand(vec2(hash(vec4(x0, y1, z1, w1)), seed)),
          rand(vec2(hash(vec4(x1, y1, z1, w1)), seed)),
          dx
        ),
        dy
      ),
      dz
    ),
    dw
  );
}
`

content.gl.sl.rand = () => `
float rand(vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt= dot(co.xy ,vec2(a,b));
  float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}
`

content.gl.sl.rotate = () => `
vec2 rotate(vec2 point, float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return vec2(
    (point.x * c) - (point.y * s),
    (point.x * s) + (point.y * c)
  );
}
`

content.gl.sl.scale = () => `
float scale(float value, float min, float max, float a, float b) {
  return a + (((value - min) / (max - min)) * (b - a));
}
`
