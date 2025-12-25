# P 大编程网格年度总结

Programming Grid Wrapped.

校内部署访问地址：https://pgw.illusion.blog（需要连接校园网访问）

Tip: 登录页面的年份是可以改的

![preview](preview.png)

## 自行部署

### Prerequests:

- Bun.js
- Node
- Caddy (or any other web server you like, without my config file)

### Build

```sh
cd client
bun run build
cd ../server
bun build \
	--compile \
	--minify \
	--target bun \
	--outfile ../server-bundle \
	./src/index.ts
cd ..
```

### Run

```sh
./server-bundle
```

and in another terminal window:

```sh
caddy run
```

## Some notes

Yes, the typing in the project is a mess, and I don't bother fixing it because:

1. It works on my machine™
2. I don't expect anyone else to read or maintain this code