# ffmpeg-http-service
ffmpeg as a service. Send a POST request, get result as a response

## Usage
```http request
POST http://localhost:3030/
Content-Type: multipart/form-data; boundary=WebAppBoundary
# mandatory: output file extension
ffmpeg-outfileext: ogg
# optional: ffmpeg options as JSON array
ffmpeg-options: [ "-acodec", "libvorbis", "-q:a", "7" ]

--WebAppBoundary

< /home/magne4000/somefile.flac
--WebAppBoundary--

###
```
