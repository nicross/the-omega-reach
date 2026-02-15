content.video.interactions = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.gl.sl.defineIns()}
${content.gl.sl.commonFragment()}

in float alpha;
out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d <= 0.0) {
    discard;
  }

  float value = 1.0;

  color = vec4(value, value, value, alpha);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.gl.sl.defineOuts()}
${content.gl.sl.defineUniforms()}
${content.gl.sl.commonVertex()}

in vec3 offset;
in vec3 vertex;

out float alpha;

void main(void) {
  float depth = clamp(
    scale(
      length(offset + u_camera),
      4.0, 5.0,
      1.0, 0.0
    ),
    0.0, 1.0
  );

  gl_Position = u_projection * vec4((vertex * (mix(0.5, 1.0, depth) + (pow(u_proximity, 8.0) * 2.0))) + offset, 1.0);

  ${content.gl.sl.passUniforms()}
  alpha = mix(0.5, 1.0, depth) * mix(0.25, 1.0, pow(u_proximity, 8.0));
}
`

  let program

  return {
    draw: function (points = app.controls.interactions.points()) {
      const gl = content.gl.context()

      gl.useProgram(program.program)
      content.gl.sl.bindUniforms(gl, program)

      // Build point data
      const camera = content.camera.vector(),
        center = {x: 0, y: 0, z: 0},
        radius = 5

      const offsets = []

      points.sort((a, b) => (b.x + (b.depth || 1)) - (a.x + (a.depth || 1)))

      for (const point of points) {
        const magnitude = (1 - (point.depth || 1)) + (radius - 1)

        offsets.push(
          (center.x + (point.x * magnitude)) - camera.x,
          (center.y + (point.y * magnitude)) - camera.y,
          (center.z + (point.z * magnitude)) - camera.z,
        )
      }

      // Bind offsets
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/4,
        quaternion: engine.position.getQuaternion(),
        width: 1/4,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, points.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.gl.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.gl.sl.attributeNames(),
          'offset',
          'vertex',
        ],
        context: gl,
        shaders: [
          {
            source: fragmentShader,
            type: gl.FRAGMENT_SHADER,
          },
          {
            source: vertexShader,
            type: gl.VERTEX_SHADER,
          },
        ],
        uniforms: [
          ...content.gl.sl.uniformNames(),
        ],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
