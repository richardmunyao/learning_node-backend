So, deployment. This particular example uses fly.io
Couple of steps. 
1. Create a fly.io account and all that. Excellent explanations found at: https://fullstackopen.com/en/part3/deploying_app_to_internet
2. Deploy your 'BACKEND' to fly.io. This is important, I lost a lot of time trying to deploy the 'frontend' and wondering why it was not listening on the port 8080 - that's not it's job.
3. In your frontend, change the 'baseUrl' to the one provided by fly, ex: https://fo-notes-backend.fly.dev/api/notes
4. In your frontend root folder, run: 'npm run build'
5. Copy the 'build' folder to your backend root
6. do: 'fly deploy' (because changes have been made) This will also move up version
7. To work on both local(pc) and remote(fly.io), configure a proxy:
7.1: Change the url to realtive urls in the frontend app part that fetches data like so: 'const baseUrl = '/api/notes''
7.2 Add a proxy in the frontend app's package.json like so: "proxy" :"http://localhost:3001"

8. To make easier the process of run build, copy and deploy, you can create a shortcut in the backend's package.json like so:
{
  "scripts": {
    // ...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",    
    "logs:prod": "fly logs"
  }
}

I'm using windows right now, so not very useful. Or I can use git bash by setting it as the default shell like so:
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"