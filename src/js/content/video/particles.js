content.video.particles = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.gl.sl.defineIns()}
${content.gl.sl.commonFragment()}

in float alpha;
in vec3 color_out;
out vec4 color;

void main() {
  color = vec4(color_out, alpha);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.gl.sl.defineOuts()}
${content.gl.sl.defineUniforms()}
${content.gl.sl.commonVertex()}

uniform mat4 u_rotation;

in vec3 color_in;
in vec3 offset;
in vec3 vertex;

out float alpha;
out vec3 color_out;

void main(void) {
  gl_Position = vec4(vertex, 0.0) + (u_rotation * vec4(offset + u_camera, 1.0)) - vec4(u_camera, 0.0);
  gl_Position = u_projection * gl_Position;

  ${content.gl.sl.passUniforms()}
  alpha = 1.0;
  color_out = hsv2rgb(color_in);
}
`

  let program

  return {
    draw: function () {
      const gl = content.gl.context()

      gl.useProgram(program.program)
      content.gl.sl.bindUniforms(gl, program)

      const activeProgram = content.programs.get(),
        camera = content.camera.vector(),
        particles = content.particles.all()

      const colors = [],
        offsets = []

      for (const particle of particles) {
        const {current, target} = particle

        if (activeProgram) {
          activeProgram.alterParticle(particle)
        } else {
          target.h = 0
          target.s = 0
          target.v = 0
          target.x = 0
          target.y = 0
          target.z = 0
        }

        current.h = engine.fn.accelerateValue(current.h, target.h, 4)
        current.s = engine.fn.accelerateValue(current.s, target.s, 4)
        current.v = engine.fn.accelerateValue(current.v, target.v, 4)
        current.x = engine.fn.accelerateValue(current.x, target.x, 8 * Math.max(1, Math.abs(target.x - current.x)))
        current.y = engine.fn.accelerateValue(current.y, target.y, 8 * Math.max(1, Math.abs(target.y - current.y)))
        current.z = engine.fn.accelerateValue(current.z, target.z, 8 * Math.max(1, Math.abs(target.z - current.z)))

        colors.push(
          current.h,
          current.s,
          current.v,
        )

        offsets.push(
          current.x - camera.x,
          current.y - camera.y,
          current.z - camera.z,
        )
      }

      // Bind colors
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.color_in)
      gl.vertexAttribPointer(program.attributes.color_in, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.color_in, 1)

      // Bind offsets
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind u_rotation
      const rotation = engine.tool.matrix4d.fromQuaternion(
        activeProgram?.getRotation() || engine.tool.quaternion.identity()
      ).transpose()

      gl.uniformMatrix4fv(program.uniforms.u_rotation, false, rotation.elements)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/64,
        quaternion: content.camera.quaternion(),
        width: 1/64,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, particles.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.color_in, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.gl.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.gl.sl.attributeNames(),
          'color_in',
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
          'u_rotation',
        ],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
