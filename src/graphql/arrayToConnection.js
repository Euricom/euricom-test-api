const PREFIX = 'connection:';

function base64(input) {
  return Buffer.from(input, 'utf8').toString('base64');
}

function unbase64(input) {
  return Buffer.from(input, 'base64').toString('utf8');
}

function offsetToCursor(offset) {
  return base64(PREFIX + offset);
}

function cursorToOffset(cursor) {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

function getOffsetWithDefault(cursor, defaultOffset) {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

function arrayToConnection(data, args) {
  return arrayToConnectionSlice(data, args, {
    sliceStart: 0,
    arrayLength: data.length,
  });
}

function arrayToConnectionSlice(arraySlice, args, meta) {
  const { after, before, first, last } = args;
  const { sliceStart, arrayLength } = meta;
  const sliceEnd = sliceStart + arraySlice.length;
  const beforeOffset = getOffsetWithDefault(before, arrayLength);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(sliceStart - 1, afterOffset, -1) + 1;
  let endOffset = Math.min(sliceEnd, beforeOffset, arrayLength);
  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

    startOffset = Math.max(startOffset, endOffset - last);
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(Math.max(startOffset - sliceStart, 0), arraySlice.length - (sliceEnd - endOffset));

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? beforeOffset : arrayLength;
  return {
    totalCount: edges.length,
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage: typeof first === 'number' ? endOffset < upperBound : false,
    },
  };
}

module.exports = arrayToConnection;
