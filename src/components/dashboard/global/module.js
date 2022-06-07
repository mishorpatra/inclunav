//Helper function for Distance(in m) between global points hi
/**
 * @param {*} firstLocation
 * @param {*} secondLocation
 * @id N2.1.1
 * @author Ushaswini Chintha
 * @description get global distance between two points
 */
export const getHaversineDistance = (firstLocation, secondLocation) => {
  const earthRadius = 6371; // km //6378137; //m
  const diffLat = ((secondLocation.lat - firstLocation.lat) * Math.PI) / 180;
  const difflon = ((secondLocation.lon - firstLocation.lon) * Math.PI) / 180;
  // console.log("difflat,difflon",diffLat,difflon,firstLocation, secondLocation)
  const arc =
    Math.cos((firstLocation.lat * Math.PI) / 180) *
      Math.cos((secondLocation.lat * Math.PI) / 180) *
      Math.sin(difflon / 2) *
      Math.sin(difflon / 2) +
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
  const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
  const distance = earthRadius * line * 1000;
  return distance;
};
//calculates Gcoordinates with given vertical and horizontal distance (should be in meters) from a refrence point
/**
 * @param {*} reference
 * @param {*} vertical
 * @param {*} horizontal
 * @id N2.1.2
 * @author Ushaswini Chintha
 * @description get coordinates from reference points
 */
export const obtaincoordinates = (reference, vertical, horizontal) => {
  const R = 6378137; //Earth’s radius, sphere
  //Coordinate offsets in radians
  var dLat = vertical / R;
  var dLon = horizontal / (R * Math.cos((Math.PI * reference.lat) / 180));
  //OffsetPosition, decimal degrees
  var latA = reference.lat + (dLat * 180) / Math.PI;
  var lonA = reference.lon + (dLon * 180) / Math.PI;
  return { lat: latA, lon: lonA };
};
/**
 *
 * @param {*} first
 * @param {*} second
 * @id N2.1.3
 * @author Ushaswini Chintha
 * @description distance between two coorinates
 */
//helper function for distance between two points in local coordinates
export const distance = (first, second) => {
  var dist =
    (second.localy - first.localy) ** 2 + (second.localx - first.localx) ** 2;
  return Math.sqrt(dist);
};
/**
 *
 * @param {*} one
 * @param {*} two
 * @param {*} three
 * @id N2.1.4
 * @author Ushaswini Chintha
 * @description get perpendicalr from 3 points
 */
//perpendicular distance of point(three) from a line formed by one and two
export const perpendicular = (one, two, three) => {
  var y = Math.sin(three.lon - one.lon) * Math.cos(three.lat);
  var x =
    Math.cos(one.lat) * Math.sin(three.lat) -
    Math.sin(one.lat) * Math.cos(three.lat) * Math.cos(three.lat - one.lat);
  var bearing1 = (Math.atan2(y, x) * 180) / Math.PI;
  bearing1 = 360 - ((bearing1 + 360) % 360);
  var y2 = Math.sin(two.lon - one.lon) * Math.cos(two.lat);
  var x2 =
    Math.cos(one.lat) * Math.sin(two.lat) -
    Math.sin(one.lat) * Math.cos(two.lat) * Math.cos(two.lat - one.lat);
  var bearing2 = (Math.atan2(y2, x2) * 180) / Math.PI;
  bearing2 = 360 - ((bearing2 + 360) % 360);
  var lat1Rads = (one.lat * Math.PI) / 180;
  var lat3Rads = (three.lat * Math.PI) / 180;
  var dLon = ((three.lon - one.lon) * Math.PI) / 180;
  var distanceAC =
    Math.acos(
      Math.sin(lat1Rads) * Math.sin(lat3Rads) +
        Math.cos(lat1Rads) * Math.cos(lat3Rads) * Math.cos(dLon)
    ) * 6371;
  var min_distance = Math.abs(
    Math.asin(
      Math.sin(distanceAC / 6371) *
        Math.sin((bearing1 * Math.PI) / 180 - (bearing2 * Math.PI) / 180)
    ) * 6371
  );
  // console.log("The perpendicular distance is: ", min_distance*1000*3.28084);
  return min_distance * 1000 * 3.28084;
};
//angle between three points; type:0 -> normal_distance, type:1 -> haversine_distance
/**
 *
 * @param {*} one
 * @param {*} two
 * @param {*} three
 * @param {*} type
 * @id N2.1.5
 * @author Ushaswini Chintha
 * @description angle between reference points
 */
export const angle = (one, two, three, type) => {
  if (type == 0) {
    //calulated using normal_distance
    var l = this.distance(one, two);
    var m = this.distance(two, three);
    var n = this.distance(one, three);
    var theta =
      (Math.acos((l * l + n * n - m * m) / (2 * l * n)) * 180) / Math.PI;
    if ((l * l + n * n - m * m) / (2 * l * n) > 1 || m == 0 || n == 0) {
      theta = 0;
    } //straight line case
    if ((l * l + n * n - m * m) / (2 * l * n) < -1) {
      theta = 180;
    } //straight line case
  } else if (type == 1) {
    //calulated using haverisine_distance
    var b = this.getHaversineDistance(one, two);
    var c = this.getHaversineDistance(one, three);
    var a = this.getHaversineDistance(two, three);
    var theta =
      (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
    if ((b * b + c * c - a * a) / (2 * b * c) > 1 || a == 0 || c == 0) {
      theta = 0;
    } //straight line case
    if ((b * b + c * c - a * a) / (2 * b * c) < -1) {
      theta = 180;
    } //straight line case
  }
  return theta;
};
/**
 *
 * @param {*} coords
 * @param {*} red_data
 * @param {*} entrance_point
 * @param {*} drop_points
 * @id N2.1.6
 * @author Ushaswini Chintha
 * @description handling hybrid points
 */
export const handleHybrid = (coords, red_data, entrance_point, drop_points) => {
  //finding the point with lowest latitude and highest longitude
  var least_lat = 0;
  var high_lon = 0;
  for (let i = 0; i < coords.length; i++) {
    if (coords[i].lat < coords[least_lat].lat) {
      least_lat = i;
    }
    if (coords[high_lon].lon < coords[i].lon) {
      high_lon = i;
    }
  }
  //building angle with equator or true horizontal
  const horizontal = this.obtaincoordinates(
    coords[least_lat],
    0,
    this.getHaversineDistance(coords[least_lat], coords[high_lon])
  );
  var out = this.angle(coords[least_lat], coords[high_lon], horizontal, 1);
  var ang;
  for (let i = 0; i < entrance_point.length; i++) {
    var theta = this.angle(
      coords[least_lat],
      coords[high_lon],
      entrance_point[i],
      0
    );
    ang = theta + out;
    var dist = this.distance(coords[least_lat], entrance_point[i]) * 0.3048; //to convert to meter
    var ver = dist * Math.sin((ang * Math.PI) / 180.0);
    var hor = dist * Math.cos((ang * Math.PI) / 180.0);
    var trans = this.obtaincoordinates(coords[least_lat], ver, hor);
    entrance_point[i].lat = trans.lat;
    entrance_point[i].lon = trans.lon;
  }
  //loop to calculate hybrid grid's local and global coordinates
  for (let p = 0; p < drop_points.length; p++) {
    var final = JSON.parse(JSON.stringify(coords)); //Deep copy of original coords
    var gpoint = drop_points[p];
    //finding nearest corner to gpoint
    var near = 0;
    for (let i = 0; i < coords.length; i++) {
      var temp = this.getHaversineDistance(gpoint, coords[i]);
      if (temp < this.getHaversineDistance(gpoint, coords[near])) {
        near = i;
      }
    }
    //angle btwn near, near+1 and gpoint
    var p1 = near;
    if (near == 3) {
      var p2 = 0;
    } else {
      var p2 = near + 1;
    }
    var theta1 = this.angle(coords[p1], coords[p2], gpoint, 1);
    //angle btwn near, near-1 and gpoint
    if (near == 0) {
      var p3 = 3;
    } else {
      var p3 = near - 1;
    }
    var theta2 = this.angle(coords[p1], coords[p3], gpoint, 1);
    //evaluating local co-ordinates of hybrid grid
    if (theta2 > 90) {
      //finding out axis
      if (coords[p2].localx - coords[p1].localx == 0) {
        //xaxis
        if (coords[p1].localx - coords[p3].localx > 0) {
          var dist = this.perpendicular(coords[p1], coords[p2], gpoint);
          final[p1].localx = final[p1].localx + dist;
          final[p2].localx = final[p2].localx + dist;
        } else if (coords[p1].localx - coords[p3].localx < 0) {
          var dist = this.perpendicular(coords[p1], coords[p2], gpoint);
          final[p1].localx = final[p1].localx - dist;
          final[p2].localx = final[p2].localx - dist;
        }
      } else if (coords[p2].localy - coords[p1].localy == 0) {
        //yaxis
        if (coords[p1].localy - coords[p3].localy > 0) {
          var dist = this.perpendicular(coords[p1], coords[p2], gpoint);
          final[p1].localy = final[p1].localy + dist;
          final[p2].localy = final[p2].localy + dist;
        } else if (coords[p1].localy - coords[p3].localy < 0) {
          var dist = this.perpendicular(coords[p1], coords[p2], gpoint);
          final[p1].localy = final[p1].localy - dist;
          final[p2].localy = final[p2].localy - dist;
        }
      }
    }
    if (theta1 > 90) {
      //finding out axis
      if (coords[p3].localx - coords[p1].localx == 0) {
        //xaxis
        var dist = this.perpendicular(coords[p1], coords[p3], gpoint);
        if (coords[p1].localx - coords[p2].localx > 0) {
          final[p1].localx = final[p1].localx + dist;
          final[p3].localx = final[p3].localx + dist;
        } else if (coords[p1].localx - coords[p2].localx < 0) {
          final[p1].localx = final[p1].localx - dist;
          final[p3].localx = final[p3].localx - dist;
        }
      } else if (coords[p3].localy - coords[p1].localy == 0) {
        //yaxis
        var dist = this.perpendicular(coords[p1], coords[p3], gpoint);
        if (coords[p1].localy - coords[p2].localy > 0) {
          final[p1].localy = final[p1].localy + dist;
          final[p3].localy = final[p3].localy + dist;
        } else if (coords[p1].localy - coords[p2].localy < 0) {
          final[p1].localy = final[p1].localy - dist;
          final[p3].localy = final[p3].localy - dist;
        }
      }
    }
    //evaluating global co-ordinates of hybrid grid
    var slope =
      (coords[high_lon].localy - coords[least_lat].localy) /
      (coords[high_lon].localx - coords[least_lat].localx);
    for (let i = 0; i < coords.length; i++) {
      if (
        final[i].localx != coords[i].localx ||
        final[i].localy != coords[i].localy
      ) {
        //translating of a corner
        //z is the line equation joining least_lat and high_lon
        if (coords[high_lon].localx - coords[least_lat].localx == 0) {
          var z = final[i].localx - coords[least_lat].localx;
        } else {
          var z =
            final[i].localy -
            coords[least_lat].localy -
            slope * (final[i].localx - coords[least_lat].localx);
        }
        var theta = this.angle(
          coords[least_lat],
          coords[high_lon],
          final[i],
          0
        );
        if (z < 0) {
          ang = -theta + out;
        } else {
          ang = theta + out;
        }
        var dist = this.distance(coords[least_lat], final[i]) * 0.3048; //to convert to meter
        var ver = dist * Math.sin((ang * Math.PI) / 180.0);
        var hor = dist * Math.cos((ang * Math.PI) / 180.0);
        var trans = this.obtaincoordinates(coords[least_lat], ver, hor);
        final[i].lat = trans.lat;
        final[i].lon = trans.lon;
      }
    }
    //correcting the hybrid vertices to remove negatives i.e translating the axes.
    var min_x = Math.min.apply(
      null,
      final.map(function(item) {
        return item.localx;
      })
    );
    var min_y = Math.min.apply(
      null,
      final.map(function(item) {
        return item.localy;
      })
    );
    for (let i = 0; i < final.length; i++) {
      final[i].localx -= min_x;
      final[i].localy -= min_y;
    }
    //translating entrance/any points according to new axis
    for (let i = 0; i < entrance_point.length; i++) {
      entrance_point[i].localx -= min_x;
      entrance_point[i].localy -= min_y;
    }
    coords = final; //for next loop
    //evaluating local coordinates of the DROPOFF point using perpendicular distance from axes
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].localx == 0 && coords[i].localy == 0) {
        var oo = i;
      } //oo-> orgin
      if (coords[i].localx == 0 && coords[i].localy != 0) {
        var on = i;
      } //on-> point on y-axis
      if (coords[i].localx != 0 && coords[i].localy == 0) {
        var no = i;
      } //no-> point on x-axis
    }
    drop_points[p].localx = this.perpendicular(coords[oo], coords[on], gpoint);
    drop_points[p].localy = this.perpendicular(coords[oo], coords[no], gpoint);
    //translating prev dropoff points according to new axis
    for (let i = 0; i < p; i++) {
      drop_points[i].localx -= min_x;
      drop_points[i].localy -= min_y;
    }
  }
  //converting to geoJSON format
  let geoJSON_ext = {
    type: "FeatureCollection",
    features: []
  };
  var arr = [];
  for (let j = 0; j < final.length; j++) {
    arr.push([final[j].lon, final[j].lat]);
  }
  geoJSON_ext.features.push({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [arr]
    }
  });
  return geoJSON_ext;
};
/**
 *
 * @param {*} nonRefined
 * @param {*} refinedPoints
 * @param {*} mapElements
 * @param {*} floor
 * @id N2.1.7
 * @author Gulshan Jangid and Akhilesh Karra
 * @description generating instructions from points
 */
export const findInstructions = (
  nonRefined,
  refinedPoints,
  mapElements,
  floor
) => {
  //length of refined and non refined paths
  let nonRefinedPoints = JSON.parse(nonRefined);
  var nRefined = refinedPoints.length;
  var nNonRefined = nonRefinedPoints.length;
  //converting the mapElements to ordered map for ease of access
  var ElementMap = new Map();
  var includedSet = new Set();
  var word;
  //for iteration purpose
  var currentNRPoint = 0;
  var currentRPoint = 0;
  var flagList = [];
  var i = 0;
  var j = 0;
  //radius defines what range to cover in a path
  var radius = 3;
  let pathTuning = [];
  //adding the elements to map
  for (i = 0; i < mapElements.length; i++) {
    let props = mapElements[i];
    if (props.element.type === "Rooms") {
      if (props.name !== "undefined") {
        Object.keys(props).map(id => {
          if (id === "roomName") {
            props[`name`] = [...props[id]].join("");
            delete props[id];
          }
        });
        ElementMap.set(
          `${props.coordinateX}@${props.coordinateY}`,
          mapElements[i]
        );
      }
    } else if (props.element.type === "FloorConnection") {
      if (props.name !== "undefined") {
        ElementMap.set(
          `${props.coordinateX}@${props.coordinateY}`,
          mapElements[i]
        );
      }
    } else if (props.element.type === "Services") {
      if (props.name !== "undefined")
        ElementMap.set(
          `${props.coordinateX}@${props.coordinateY}`,
          mapElements[i]
        );
    } else if (props.element.type === "RestRooms") {
      if (props.name !== "undefined")
        ElementMap.set(
          `${props.coordinateX}@${props.coordinateY}`,
          mapElements[i]
        );
    } else {
    }
  }
  // //finding the indices of the
  while (currentNRPoint < nNonRefined && currentRPoint < nRefined) {
    if (
      nonRefinedPoints[currentNRPoint][0] === refinedPoints[currentRPoint].x &&
      nonRefinedPoints[currentNRPoint][1] === refinedPoints[currentRPoint].y
    ) {
      flagList.push(currentNRPoint);
      currentRPoint++;
    }
    currentNRPoint++;
  }
  // Generating the direction and elaborated results
  var DirectionResults = [];
  var ElaboratedResults = [];
  //entry point insertion to the list
  DirectionResults.push(
    "You are at " +
      ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y).name
  );
  ElaboratedResults.push(
    "You are at " +
      ElementMap.get("" + refinedPoints[0].x + "@" + refinedPoints[0].y).name
  );
  includedSet.add(refinedPoints[0].x + "@" + refinedPoints[0].y);
  includedSet.add(
    refinedPoints[nRefined - 1].x + "@" + refinedPoints[nRefined - 1].y
  );

  //iterate and /finding the desired results
  var error = 0;
  for (currentRPoint = 0; currentRPoint < nRefined - 1; currentRPoint++) {
    var angle = 0;
    var coordinates;
    // this.actualAngle = 155
    if (currentRPoint === 0) {
      angle = find_angle(
        {
          x: refinedPoints[currentRPoint].x,
          y: refinedPoints[currentRPoint].y + 1
        },
        refinedPoints[currentRPoint + 1],
        refinedPoints[currentRPoint]
      );

      let path_angle = angle;
      let floorangle = 270;
      let diff = 360 - floorangle;
      // let CurrentDirection = 60;
      let CurrentDirection = 0;
      let gn = calculatePath(path_angle, diff, CurrentDirection);
      angle = gn;
    } else
      angle = find_angle(
        refinedPoints[currentRPoint - 1],
        refinedPoints[currentRPoint + 1],
        refinedPoints[currentRPoint]
      );
    angle = angle + error;
    error = findErrorInAngle(angle);
    let hypo = 0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint]);
    let base = Math.cos(angle) * hypo;
    let height = Math.sin(angle) * hypo;
    var forwardStep = parseInt(Math.abs(height));
    var lastStep = parseInt(Math.abs(base));
    let steps = Math.round(parseInt(forwardStep + hypo));
    if (currentRPoint === nRefined - 2) {
      console.log(flagList);
      word = findDirectionword(angle);
      DirectionResults.push(word);
      DirectionResults.push(
        "Move " +
          Math.round(
            0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
          ) +
          " steps forward"
      );
      pathTuning.push({
        points: refinedPoints[currentRPoint],
        angle: angle,
        base,
        height,
        word
      });
      break;
    }
    if (hypo <= 6) {
      word = findDirectionword(angle);
      if (word.includes("Turn 0 O' Clock")) {
        word = "Go straight";
      }
      pathTuning.push({
        points: refinedPoints[currentRPoint],
        angle: angle,
        base,
        height,
        word
      });
      DirectionResults.push(word + " and move"+steps+"steps forward");
      	
    } else {
      word = findDirectionword(angle);
      pathTuning.push({
        points: refinedPoints[currentRPoint],
        angle: angle,
        base,
        height,
        word
      });
      let step = parseInt(
        Math.round(
          0.6 * (flagList[currentRPoint + 1] - flagList[currentRPoint])
        )
      );
      DirectionResults.push(word);
      DirectionResults.push(" Move " + step + " steps forward");
    }
    //this part of code handles the intermediate importatnt rooms
    var begin = flagList[currentRPoint] + 1;
    var end = flagList[currentRPoint + 1];

    while (begin < end) {
      var currpoint = nonRefinedPoints[begin];
      for (
        i = Math.max(0, currpoint[0] - radius);
        i < currpoint[0] + radius;
        i++
      ) {
        for (
          j = Math.max(0, currpoint[1] - radius);
          j < currpoint[1] + radius;
          j++
        ) {
          if (!includedSet.has(i + "@" + j) && ElementMap.has(i + "@" + j)) {
            var tempAngle = find_angle(
              {
                x: nonRefinedPoints[begin - 1][0],
                y: nonRefinedPoints[begin - 1][1]
              },
              { x: i, y: j },
              { x: nonRefinedPoints[begin][0], y: nonRefinedPoints[begin][1] }
            );
            ElaboratedResults.push(
              ElementMap.get(i + "@" + j).roomName +
                " on your " +
                findDirectionAbbreviation(tempAngle)
            );
            includedSet.add(i + "@" + j);
          }
        }
      }
      begin++;
    }
  }
  let elem = ElementMap.get(
    "" + refinedPoints[nRefined - 1].x + "@" + refinedPoints[nRefined - 1].y
  );
  if (
    elem.element.type === "Services" &&
    elem.element.subType === "Rest Rooms"
  ) {
    let name = `${elem.washroomType} Washroom (${elem.floor} Floor)`;
    DirectionResults.push("You will reach " + name);
  } else if (
    elem.element.type === "Services" &&
    elem.element.subType === "Drinking Water | Non Drinking"
  ) {
    let name = `Drinking Water Point (${elem.floor} Floor)`;
    DirectionResults.push("You will reach " + name);
  } else {
    DirectionResults.push(
      "You will reach " +
        ElementMap.get(
          "" +
            refinedPoints[nRefined - 1].x +
            "@" +
            refinedPoints[nRefined - 1].y
        ).name
    );
  }
  ElaboratedResults.push(
    "You have reached " +
      ElementMap.get(
        "" + refinedPoints[nRefined - 1].x + "@" + refinedPoints[nRefined - 1].y
      ).name
  );
  return DirectionResults;
};
/**
 *
 * @param {*} path_angle
 * @param {*} diff
 * @param {*} CurrentDirection
 * @id N2.1.9
 * @author Gulshan Jangid
 * @description calculate path
 */
var calculatePath = (path_angle, diff, CurrentDirection) => {
  let pathGN, rotateDirection, path_angleN;
  if (path_angle >= 0 && path_angle < 106) {
    pathGN = 360 - (diff - path_angle);
    rotateDirection = pathGN - CurrentDirection;
  } else if (path_angle > 105 && path_angle <= 180) {
    pathGN = path_angle - diff;
    rotateDirection = pathGN - CurrentDirection;
  } else if (path_angle <= -1 && path_angle >= -180) {
    path_angleN = 180 + path_angle;
    pathGN = path_angleN + 180 - diff;
    rotateDirection = pathGN - CurrentDirection;
  }
  return rotateDirection;
};
/**
 *
 * @param {*} points
 * @param {*} tolerance
 * @id N2.1.10
 * @author Gulshan Jangid
 * @description simplify points
 */
export const simplifyPath = (points, tolerance) => {
  // helper classes
  var Vector = function(x, y) {
    this.x = x;
    this.y = y;
  };
  var Line = function(p1, p2) {
    this.p1 = p1;
    this.p2 = p2; 
    this.distanceToPoint = function(point) {
      // slope
      var m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x),
        // y offset
        b = this.p1.y - m * this.p1.x,
        d = [];
	if(this.p2.x==this.p1.x){
	d.push(point.x-p2.x);}
      // distance to the linear equation
	else{
      d.push(
        Math.abs(point.y - m * point.x - b) / Math.sqrt(Math.pow(m, 2) + 1)
      );}
      // distance to p1
      d.push(
        Math.sqrt(
          Math.pow(point.x - this.p1.x, 2) + Math.pow(point.y - this.p1.y, 2)
        )
      );
      // distance to p2
      d.push(
        Math.sqrt(
          Math.pow(point.x - this.p2.x, 2) + Math.pow(point.y - this.p2.y, 2)
        )
      );
      // return the smallest distance
      return d.sort(function(a, b) {
        return a - b; //causes an array to be sorted numerically and ascending
      })[0];
    };
    this.intersectPoint = function(po1,po2) {
      var m = (this.p1.y-this.p2.y)/(this.p1.x - this.p2.x);
      var m1 = (po1.y-po2.y)/(po1.x-po2.x);
      var b = this.p1.y-m*this.p1.x;
      var b1 = po1.y - m1*po1.x;
      var x2=0;
      var y2 = 0;
      if(this.p1.x === this.p2.x){
        x2 = this.p1.x;
        y2 = m1*x2 + b1;  
      }else 
      if(po1.x === po2.x){
        x2 = po1.x;
        y2 = m*x2 + b;
       } else{
         x2 = (b1-b)/(m-m1);
         y2 = m*x2 + b;
       }
       return {x:Math.round(x2),y:Math.round(y2)};

    }
  };
  /**
   *
   * @param {*} points
   * @param {*} tolerance
   * @id N2.1.11
 * @author Gulshan Jangid
 * @description algorithm to generate smooth line
   */
  var douglasPeucker = function(points, tolerance) {
    if (points.length <= 2) {
      return [points[0]];
    }
    var returnPoints = [],
      // make line from start to end
      line = new Line(points[0], points[points.length - 1]),
      // find the largest distance from intermediate poitns to this line
      maxDistance = 0,
      maxDistanceIndex = 0,
      p;
    for (var i = 1; i <= points.length - 2; i++) {
      var distance = line.distanceToPoint(points[i]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceIndex = i;
      }
   }
    // check if the max distance is greater than our tollerance allows
    if (maxDistance >= tolerance) {
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      // include this point in the output
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance)
      );
      // returnPoints.push( points[maxDistanceIndex] );
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance)
      );
    } else {
      // ditching this point
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      returnPoints = [points[0]];
    }
    return returnPoints;
  };
  var arr = douglasPeucker(points, tolerance);
  // always have to push the very last point on so it doesn't get left off
  arr.push(points[points.length - 1]);
  for(let i=0;i<arr.length-3;i++){
    var l1 = new Line(arr[i],arr[i+1]);
    var l2 = new Line(arr[i+1],arr[i+2]);
    var l3 = new Line(arr[i+2],arr[i+3]);
    var dist = Math.sqrt((arr[i+1].x-arr[i+2].x)*(arr[i+1].x-arr[i+2].x) + (arr[i+1].y-arr[i+2].y)*(arr[i+1].y-arr[i+2].y));
    if(dist<5){
      //find intersecting point of l1 and l3
      var point = l1.intersectPoint(arr[i+2],arr[i+3]);
      arr.splice(i+1,2,point);
      console.log(point);
      
    }
  }
  console.log(arr);
  return arr;
};
/**
 *
 * @param {*} p0
 * @param {*} p1
 * @param {*} c
 * @id N2.1.12
 * @author Gulshan Jangid
 * @description find angle
 */
export const find_angle = (p0, p1, c) => {
  var p0c = { x: c.x - p0.x, y: c.y - p0.y }; // p0->c (b)
  var cp1 = { x: p1.x - c.x, y: p1.y - c.y }; // p1->c (a)
  return (
    (Math.atan2(cp1.y * p0c.x - cp1.x * p0c.y, p0c.x * cp1.x + p0c.y * cp1.y) *
      180) /
    Math.PI
  );
};
//Module for finding the direction's equivalent commands
/**
 *
 * @param {*} angle
 * @id N2.1.13
 * @author Gulshan Jangid
 * @description find direction word
 */
export const findDirectionword = angle => {
  if (angle >= 75 && angle <= 105) return "Turn Right";
  if (angle <= -75 && angle >= -105) return "Turn Left";
  if ((angle >= 165 && angle <= 180) || (angle <= -165 && angle >= -180))
    return "Go Straight";
  if (angle < 0) {
    if (Math.round((360 + angle) / 30) === 9) {
      return "Turn Left";
    }
    return "Turn " + Math.round((360 + angle) / 30) + " O' Clock";
  }
  if (Math.floor(angle / 30) === 3) return "Turn Right";
  return "Turn " + Math.round(angle / 30) + " O' Clock";
};
/**
 *
 * @param {*} angle
 * @id N2.1.14
 * @author Gulshan Jangid
 * @description generate word from angle
 */
export const findWord = angle => {
  if (angle >= 75 && angle <= 105) return "Turn Right";
  if (angle <= -75 && angle >= -105) return "Turn Left";
  if ((angle >= 165 && angle <= 180) || (angle <= -165 && angle >= -180))
    return "Go Straight";
  if (angle < 0) {
    if (Math.round((360 + angle) / 30) === 9) {
      return "Turn Left";
    }
    return "Turn left";
    //   return "Turn " + Math.round((360 + angle) / 30) + " O' Clock";
  }
  if (Math.floor(angle / 30) === 3) return "Turn Right";
  return "Turn right";
  // return "Turn " + Math.round(angle / 30) + " O' Clock";
};
/**
 *
 * @param {*} angle
 * @id N2.1.15
 * @author Gulshan Jangid
 * @description error in angle
 */
// find the error component in the iteration and leaves it for the next iteration
export const findErrorInAngle = angle => {
  if (angle < 0) return 360 + angle - Math.round((360 + angle) / 30) * 30;
  return angle - Math.round(angle / 30) * 30;
};
//same as above but in abbreviated form
/**
 *
 * @param {*} angle
 * @id N2.1.16
 * @author Gulshan Jangid
 * @description direction abbreviation
 */
export const findDirectionAbbreviation = angle => {
  if (angle > 0) return "Right";
  return "Left";
};
