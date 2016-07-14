import bl from 'bl'
import through from 'through2'

function parser (data, opts) {
  const toLine = opts.json ? toLineJSON : toLineString

  const result = through.obj(opts.tty ? parseTty : parse)

  const payload = bl()
  const headers = bl()
  let streamType

  return result

  function parseTty (chunk, enc, cb) {
    payload.append(chunk)
    publish()
    return cb()
  }

  function parse (chunk, enc, cb) {
    const buffer = bl(chunk)

    while (buffer.length) {
      readAndConsume(buffer, headers, 8)

      if (headers.length !== 8) {
        return cb()
      }
      const payloadLength = headers.readUInt32BE(4)
      streamType = [
        'stdin',
        'stdout',
        'stderr'
      ][headers.readUInt8(0)]
      headers.consume(8)

      if (!buffer.length) {
        return cb()
      }

      readAndConsume(buffer, payload, payloadLength)
      publish()
    }

    return cb()
  }

  function publish () {
    if (opts.newline) {
      const lines = payload.toString().split('\n').slice(0, -1)
      for (const line of lines) {
        result.push(buildObject(line))
        payload.consume(Buffer.byteLength(line) + 1)
      }
    } else {
      result.push(buildObject(payload))
      payload.consume(payload.length)
    }
  }

  function buildObject (chunk) {
    return [data.node, data.service, data.slot, streamType].join('.') + ': ' + toLine(chunk) + '\n'
    // {
    //   v: 0,
    //   id: data.id.slice(0, 12),
    //   image: data.image,
    //   name: data.name,
    //   time: Date.now(),
    //   line: toLine(chunk)
    // }
  }

  function toLineJSON (line) {
    try {
      return JSON.parse(line)
    } catch (err) {
      return toLineString(line)
    }
  }

  function toLineString (line) {
    return line.toString().replace(/\n$/, '')
  }

  function readAndConsume (src, dest, count) {
    dest.append(src.slice(0, count))
    src.consume(count)
    return count
  }
}

export default parser
