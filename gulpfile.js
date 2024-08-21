const fsreader = require('node:fs/promises')
const fs = require('node:fs')
const path = require('path')
const gulp = require('gulp')
const { series } = require('gulp')
const hb = require('handlebars')

const srcPath = `${path.join('src', 'templates')}`
const extensions = {
    compiled: "compiled.html",
    html: "html",
    json: "json"
}
const watchPaths = {
    template: [`${srcPath}/**/*.${extensions.html}`],
    data: [`${srcPath}/**/*.${extensions.json}`]
}

// Gulp task to build template
async function build() {
    const file = await _files(extensions.html)
    for (const f of file) {
        const parsed = await _parse(f)
        _render(parsed)
    }

}
// Gulp task to remove compiled HB files on start
async function clean() {
    const file = await _files(extensions.compiled)
    for (const f of file) {
        fs.unlink(f, (err) => {
            if (err) {
                console.error(`Failed to delete file ${f}`)
            } else {
                console.log(`Deleted file ${f}`)
            }
        })
    }
}

gulp
    .watch([watchPaths.template, watchPaths.data])
    .on("change", function (file) {
        if (file.endsWith(extensions.compiled)) {
            return
        }

        const parsed = _parse(file)
        _render(parsed)
    })

function _render(fileinfo) {
    const filepath = fileinfo[0]
    const filename = fileinfo[1]

    const source = fs.readFileSync(`${path.join(filepath, filename)}.${extensions.html}`, 'utf-8')
    const data = fs.readFileSync(`${path.join(filepath, filename)}.${extensions.json}`, 'utf-8')
    const template = hb.compile(source)
    const result = template(JSON.parse(data))

    fs.writeFile(`${path.join(filepath, filename)}.compiled.${extensions.html}`, result, (err) => {
        if (err) {
            console.error(`Error when creating ${path.join(filepath, filename)}.compiled.${extensions.html}`)
        }
        else {
            console.info(`Rendered ${path.join(filepath, filename)}.compiled.${extensions.html}`)
        }
    })
}
function _parse(f) {
    var result = []
    // path
    result.push(f.substring(0, f.lastIndexOf(path.sep)))

    // file
    var filename = f.substring(f.lastIndexOf(path.sep) + 1)
    var file = filename.split('.')
    // file name
    result.push(file[0])

    // file extension
    result.push(file[1])

    return result
}
async function _files(extension) {
    const files = (await fsreader.readdir(srcPath, { recursive: true }))
    var result = []
    for (const file of files) {
        const stats = fs.statSync(`${path.join(srcPath, file)}`)
        if (!stats.isDirectory() && file.endsWith(extension)) {
            console.log(`Pushed ${path.join(srcPath, file)} in result`)
            result.push(`${path.join(srcPath, file)}`)
        }
    }
    return result
}

exports.default = series(clean, build)