# An example of setting up a free CORS proxy on Vercel running "CORS Anywhere"

[Original article](https://geshan.com.np/blog/2021/01/free-nodejs-hosting/)

* Clone the [repo](https://gitlab.com/catamphetamine/anychan-proxy) on GitLab.
* Edit `config.json` as appropriate and push the change.
* Login to [Vercel](https://vercel.com/) using your GitLab account.
* "Add New" → "Project".
* "GitLab".
* Click the "Import" button next to the cloned project.
* After the project has been deployed, it will show the website URL. Use it as a proxy server URL. Example: `https://anychan-proxy.vercel.app?url={urlEncoded}`.