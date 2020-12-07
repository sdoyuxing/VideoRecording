declare var MediaRecorder: any;

export class MediaStreamRecorder {
    constructor(mdStream: MediaStream) {
        this.mdStream = mdStream
    }
    private mediaRecorder: any
    protected mdStream: MediaStream
    private blobs: ArrayBuffer[] = []
    public record(): void {
        this.mediaRecorder = new MediaRecorder(this.mdStream, {
            checkForInactiveTracks: false,
            mimeType: "video/webm"
        });

        this.mediaRecorder.start(3.6e+6);
    }
    public stop(): Promise<Blob> {
        return new Promise((resolve) => {
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size) {
                    this.blobs.push(e.data);
                    resolve(this.getBlobs());
                }
            }
            this.mediaRecorder.stop();
        })
    }
    public getBlobs(): Blob {
        return new Blob(this.blobs, { type: 'video/webm' })
    }
}