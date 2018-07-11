FROM node

# CMD npm run dev
# COPY build /app/build
# COPY config /app/config
# COPY src /app/src
# COPY static /app/static
# COPY index.html /app/index.html
COPY package.json /app/package.json
# COPY .babelrc /app/.babelrc
# COPY .editorconfig /app/.editorconfig
# COPY .eslintignore /app/.eslintignore
# COPY .eslintrc.js /app/.eslintrc.js
# COPY .postcssrc.js /app/.postcssrc.js

EXPOSE 8080

WORKDIR /app

# RUN ["npm", "install", "--registry https://registry.npm.taobao.org"]
RUN npm install --registry=https://registry.npm.taobao.org
# RUN ["npm", "install"]

VOLUME [ "/app" ]

CMD ["npm", "run", "dev"]