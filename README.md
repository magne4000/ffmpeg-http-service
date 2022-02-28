# ffmpeg-http-service
ffmpeg as a service. Send a POST request, get result as a response

## Usage
```http request
POST http://localhost:3000/
Content-Type: multipart/form-data; boundary=WebAppBoundary
# mandatory: output file extension
ffmpeg-outfileext: ogg
# optional: ffmpeg options as JSON array
ffmpeg-options: [ "-acodec", "libvorbis", "-q:a", "7" ]

--WebAppBoundary
Content-Disposition: form-data; name="field-name"; filename="somefile.flac"

< /home/magne4000/somefile.flac
--WebAppBoundary--

###
```

Available as a docker image: `magne4000/ffmpeg-http-service`
