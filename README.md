# P 大编程网格年度总结

Programming Grid Wrapped.

校内部署访问地址：https://pgw.illusion.blog（需要连接校园网访问）

Tip: 登录页面的年份是可以改的

![preview](preview.png)

## Build Dependencies

- Bun.js
- Node.js

## Build

```sh
bun install
bun build
```

Output at `./dist`

Note: Server bundle target defaults to bun-linux-x64, modify `package.json` if needed.

## Deploy Dependencies

- Caddy

## Deploy

1. Copy output directory to target server
2. Modify Caddyfile
3. Start `./dist/server`
4. Start Caddy

## Some notes

Yes, the typing in the project is a mess, and I don't bother fixing it because:

1. It works on my machine™
2. I don't expect anyone else to read or maintain this code
