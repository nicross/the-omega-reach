content.video.particles = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.gl.sl.defineIns()}
${content.gl.sl.commonFragment()}

in float alpha;
in vec3 color_out;
out vec4 color;

void main() {
  color = vec4(mix(
    color_out,
    vec3(1.0),
    pow(proximity, 3.0)
  ), alpha);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.gl.sl.defineOuts()}
${content.gl.sl.defineUniforms()}
${content.gl.sl.commonVertex()}

uniform vec3 u_lightSource;
uniform vec3 u_pointers[8];
uniform mat4 u_rotation;

in vec3 color_in;
in vec3 offset;
in vec3 vertex;

out float alpha;
out vec3 color_out;

float calculatePointerProximity(vec3 rotated) {
  float distance = 999.0;

  for (int i = 0; i < 8; i += 1) {
    if (length(u_pointers[i]) > 0.0) {
      distance = min(distance, length(u_pointers[i] - (length(rotated) < 6.0 ? normalize(rotated) : rotated)));
    }
  }

  return clamp(scale(distance, 0.0, 2.0, 1.0, 0.0), 0.0, 1.0);
}

void main(void) {
  vec4 rotated = (u_rotation * vec4(offset + u_camera, 1.0));
  float proximityRatio = calculatePointerProximity(rotated.xyz);

  rotated = mix(rotated, normalize(rotated) * 5.0, pow(proximityRatio, 8.0));

  gl_Position = vec4(vertex, 0.0) + rotated - vec4(u_camera, 0.0);

  gl_Position.x += (perlin4d(vec4(normalize(rotated.xyz), u_time * 4.0), 0.0) * pow(u_proximity, 3.0) - 0.5) * 0.25;
  gl_Position.y += (perlin4d(vec4(normalize(rotated.xyz), u_time * 4.0), 1.0) * pow(u_proximity, 3.0) - 0.5) * 0.25;
  gl_Position.z += (perlin4d(vec4(normalize(rotated.xyz), u_time * 4.0), 2.0) * pow(u_proximity, 3.0) - 0.5) * 0.25;

  gl_Position = u_projection * gl_Position;

  // Apply shadow
  vec3 hsv = vec3(color_in);

  if (length(u_lightSource) > 0.0) {
    float d = dot(normalize(rotated.xyz), u_lightSource);

    if (d < 0.0) {
      hsv.y *= mix(0.5, 1.0, pow(1.0 + d, 4.0));
      hsv.z *= mix(0.25, 1.0, pow(1.0 + d, 4.0));
    }
  }

  ${content.gl.sl.passUniforms()}
  alpha = 1.0;
  color_out = hsv2rgb(hsv);
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
        current.x = engine.fn.accelerateValue(current.x, target.x, 6 * Math.max(1, Math.abs(target.x - current.x)))
        current.y = engine.fn.accelerateValue(current.y, target.y, 6 * Math.max(1, Math.abs(target.y - current.y)))
        current.z = engine.fn.accelerateValue(current.z, target.z, 6 * Math.max(1, Math.abs(target.z - current.z)))

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

      // Bind u_lightSource
      const lightSource = activeProgram?.getLightSource() || engine.tool.vector3d.create()
      gl.uniform3fv(program.uniforms.u_lightSource, [lightSource.x, lightSource.y, lightSource.z])

      // Bind u_pointers[0]
      const points = []

      for (const point of app.controls.interactions.points()) {
        points.push(point.x, point.y, point.z)
      }

      while (points.length < 8*3) {
        points.push(0)
      }

      gl.uniform3fv(program.uniforms['u_pointers[0]'], points)

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
          'u_lightSource',
          'u_pointers[0]',
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
