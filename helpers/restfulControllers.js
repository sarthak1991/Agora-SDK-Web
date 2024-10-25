import CONSTANTS from "./CONSTS";
import generate from "./generators";

const bearerToken = generate.authenticateCloud();

const TOKEN_SERVER_URL = "http://localhost:8080";
const local_token_server = "http://localhost:8080"
const url_to_send = local_token_server

// console.log(bearerToken);

const fetchResults = async (URL, requestBody = null, method = CONSTANTS.METHOD) => {
  const body = JSON.stringify(requestBody);

  const options = {
    method,
    headers: {
      Authorization: `${bearerToken}`,
      "Content-Type": "application/json",
    },
    body,
  };

  let dataToReturn = null;
  try {
    const response = await fetch(URL, options);

    dataToReturn = response;
  } catch (error) {
    console.log("There has been an error");
    console.log(error);
    dataToReturn = error;
  }

  return dataToReturn;
};

// ========================== WEB RECORDING BLOCK STARTS ================

export const acquireRecording = async (APPID, AccessChannel, uid) => {
  let acquired = false;
  const acquireURL = url_to_send;



  const requestBody = {

    cname: AccessChannel,
    uid,
    clientRequest: {
      resourceExpiredHour: 24,
      scene: 1,
    }


  };

  const response = await fetchResults(`${acquireURL}/acquireWebRecording`, { useableBody: requestBody, url: `https://api.agora.io/v1/apps/${APPID}/cloud_recording/acquire` });

  const data = await response.json();

  console.log("data==> ", data);

  acquired = response.status == 200 ? true : false;

  console.log("acquired==> ", acquired);
  return data;
};

export const startWebRecording = async (
  APPID,
  resourceID,
  cname,
  uid,
  rtcToken,
  mode = "web"
) => {



  const webRecordingUrl = url_to_send;

  const requestBody = {

      cname,
      uid,
      clientRequest: {
        token: rtcToken,
        extensionServiceConfig: {
          errorHandlePolicy: "error_abort",
          extensionServices: [
            {
              serviceName: "web_recorder_service",
              errorHandlePolicy: "error_abort",
              serviceParam: {
                url: "https://recording-agora-calls.netlify.app/",
                audioProfile: 0,
                videoWidth: 1280,
                videoHeight: 720,
                maxRecordingHour: 72,
              },
            },
          ],
        },
        recordingFileConfig: {
          avFileType: ["hls", "mp4"],
        },
        storageConfig: {
          vendor: 1,
          region: 14,
          bucket: "agoracloudrecordingdemo",
          accessKey: CONSTANTS.accessKey,
          secretKey: CONSTANTS.secretKey,
        },
      }

    
  };

  console.log("recording requestBody => ", requestBody);

  // do NOT uncomment lines 1-5 until you are ready to record.

  const response = await fetchResults(`${webRecordingUrl}/createWebRecording`, {useableBody:requestBody, url: `https://api.agora.io/v1/apps/${APPID}/cloud_recording/resourceid/${resourceID}/mode/${mode}/start`});

  const data = await response.json();

  console.log("data==> ", data);

  console.log(
    "recording has started?==> ",
    response.status == 200 ? true : false
  );
  return data;

  //   function ends here
};

export const stopWebRecording = async (
  APPID,
  resourceId,
  sid,
  AccessChannel,
  RecordingUID,
  mode = "web"
) => {

  const stopWebRecordingUrl = url_to_send;

  const requestBody = {

      cname: AccessChannel,
      uid: RecordingUID,
      clientRequest: {}

    
  };

  console.log("stop recording requestBody => ", {useableBody:requestBody, url: `https://api.agora.io/v1/apps/${APPID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/stop`});
  // do NOT uncomment lines 1-5 until you are ready to record.

  const response = await fetchResults(`${stopWebRecordingUrl}/stopWebRecording`, requestBody);

  const data = await response.json();

  console.log("data==> ", data);

  console.log(
    "recording has stopped?==> ",
    response.status == 200 ? true : false
  );
  return data;
};



// ========================== WEB RECORDING BLOCK ENDS =================

// ========================== MEDIA PUSH BLOCK START ================

export const createRtmpConverter = async (
  name,
  region,
  APPID,
  AccessChannel,
  ImageUID,
  RTMPUrl,
  rtcToken,
  idleTimeout = 300
) => {
  const requestBody = {
    converter: {
      name,
      transcodeOptions: {
        rtcChannel: AccessChannel,
        token: rtcToken,
        audioOptions: {
          codecProfile: "LC-AAC",
          sampleRate: 48000,
          bitrate: 48,
          audioChannels: 1,
        },
        videoOptions: {
          canvas: {
            width: 1280,
            height: 720,
          },
          layout: [
            {
              rtcStreamUid: ImageUID,
              region: {
                xPos: 0,
                yPos: 0,
                zIndex: 1,
                width: 640,
                height: 720,
              },
              fillMode: "fill",
              placeholderImageUrl:
                "http://example.agora.io/host_placeholder.jpg",
            },
          ],
          codecProfile: "main",
          frameRate: 30,
          gop: 60,
          bitrate: 2500,
        },
      },
      rtmpUrl: RTMPUrl,
      idleTimeOut: idleTimeout,
    },
    region: CONSTANTS.rtmpRegion,
    APPID: CONSTANTS.APPID,
  };

  console.log("Request Body for RTMP Converter");
  console.log(requestBody);

  // let urlForCreateStream =

  try {
    const response = await fetch(`${url_to_send}/createLiveStream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    // console.log("RTMP converter created-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=>>>>>>>>>>>>>>>>>>>>>>>>>", data);
    return data;
  } catch (error) {
    console.error("Error creating RTMP converter:", error);
    throw error;
  }
};


export const deleteRtmpConverter = async (region, APPID, id) => {
  const requestBody = { id };


  try {
    const response = await fetch(`${url_to_send}/deleteLiveStream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If the server returns no content, just return a success message
    if (response.status === 204) {
      return { message: "RTMP converter deleted successfully" };
    }

    // If the server returns content, parse and return it
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting RTMP converter:", error);
    throw error;
  }
};

// ========================== MEDIA PUSH BLOCK END ==================

// ========================== MEDIA PULL BLOCK START ==================

export const createCloudPlayer = async (region, APPID, InjectUrl, AccessChannel, CloudPlayerUID, token, idleTimeout) => {
  console.log("HIIIIII from inside create cloud player ie media pull");

  const requestBody = {
    player: {
      streamUrl: InjectUrl,
      channelName: AccessChannel,
      token,
      uid: CloudPlayerUID,
      idleTimeout: idleTimeout,
      name: generate.uid()
    }
  };

  console.log(requestBody);

  try {
    const response = await fetch(`${TOKEN_SERVER_URL}/createMediaPull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating cloud player:", error);
    throw error;
  }
};

export const deleteCloudPlayer = async (region, APPID, id) => {

  const requestBody = { id };

  console.log(
    "+__+_+_+_+_+_+_+_+_+DAta from stream create=====----+__+_+_+_+_+_"
  );
  console.log(id);

  try {
    const response = await fetch(`${TOKEN_SERVER_URL}/deleteMediaPull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If the server returns no content, just return a success message
    if (response.status === 204) {
      return { message: "RTMP converter deleted successfully" };
    }

    // If the server returns content, parse and return it
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting RTMP converter:", error);
    throw error;
  }
};



// ========================== MEDIA PULL BLOCK END ====================





export const acquireRTS = async (instanceid) => {

  let APPID = CONSTANTS.APPID

  const acquireURL = url_to_send;

  const requestBody = {
    instanceId: instanceid
  }

  const response = await fetchResults(`${acquireURL}/acquireRts`, { useableBody: requestBody, url: `https://api.agora.io/v1/projects/${APPID}/rtsc/speech-to-text/builderTokens` });

  const data = await response.json();

  console.log("data==> ", data);

  let acquired = response.status == 200 ? true : false;

  console.log("acquired==> ", acquired);
  return data;

}



export const startRTS = async (APPID, builderToken, AccessChannel, subBotUid, subBotToken, pubBotUid, pubBotToken, accessKey = "actualToken", secretKey = "actualKey", bucket = "Nobucket", vendor = 1, region = 14) => {


  // return


  const URL = url_to_send;

  const requestBody = {
    languages: [
      "en-US"
    ],
    maxIdleTime: 60,
    rtcConfig: {
      channelName: AccessChannel,
      subBotUid,
      subBotToken,
      pubBotUid,
      pubBotToken
    },
    captionConfig: {
      storage: {
        accessKey,
        secretKey,
        bucket,
        vendor,
        region,
        "fileNamePrefix": [
          "arun94"
        ]
      }
    },
    "translateConfig": {
      "forceTranslateInterval": 5,
      "languages": [
        {
          "source": "en-US",
          "target": ["ru-RU"]
        }
      ]
    }
  }

  const response = await fetchResults(`${URL}/createRts`, { useableBody: requestBody, url: `https://api.agora.io/v1/projects/${APPID}/rtsc/speech-to-text/tasks?builderToken=${builderToken}` });

  const data = await response.json();

  console.log("data==> ", data);

  let acquired = response.status == 200 ? true : false;

  console.log("acquired==> ", acquired);
  return data;

}



export const stopRTS = async (APPID, taskId, builderToken) => {
  const agoraURL = `https://api.agora.io/v1/projects/${APPID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${builderToken}`;
  // Make sure this matches your backend route exactly
  const backendURL = 'http://localhost:8080/stopRts'; // Updated URL

  console.log('Stopping RTS with URL:', agoraURL);

  try {
    const response = await fetch(backendURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: agoraURL,
        appId: APPID,
        taskId: taskId,
        builderToken: builderToken
      })
    });

    console.log('Response status:', response.status);

    // Only try to parse JSON if we have a successful response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if there's actually content to parse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      return { success: true, message: "Operation completed" };
    }

  } catch (error) {
    console.error("Error in stopRTS:", error);
    throw error;
  }
};





// You can start changing after this



// And this, for good measure.