
// log
var log = function() {
    console.log.apply(console, arguments);
}
var songList = ["空白格.mp3", "其实都没有.mp3", "if you.mp3"]
var bindAppendAudio = function() {
    log('audio')
    var audio = `<audio id=id-audio-player src="music/${songList[0]}"></audio>`
    $('body').append(audio)
}
bindAppendAudio()

var titleList = function(songList) {
    var list = []
    for (var i = 0; i < songList.length; i++) {
        var len = songList[i].length
        var s = songList[i].slice(0,len -4)
        list.push(s)
    }
    log('titleList', list)
    return list
}

var bindAddSongList = function() {
    var playlist = $('.player-list-container')
    var list = titleList(songList)
    for (var i = 0; i < list.length; i++) {
        var s = list[i]
        var song = `<div class="song">${s}</div>`
        playlist.append(song)
    }
}
bindAddSongList()


var prevSrc = function(src) {
    var len = songList.length
    for (var i = 0; i < songList.length; i++) {
        var s = `music/${songList[i]}`
        if (src == s) {
            if (i == 0) {
                var title = titleList(songList)[len - 1]
                $('#id-h1-song-title>i').text(title)
                return `music/${songList[len - 1]}`
            }
            var title = titleList(songList)[i - 1]
            $('#id-h1-song-title>i').text(title)
            return `music/${songList[i - 1]}`
        }
    }
}
var nextSrc = function(src) {
    var len = songList.length
    for (var i = 0; i < songList.length; i++) {
        var s = `music/${songList[i]}`
        if (src == s) {
            if (i == len - 1) {
                var title = titleList(songList)[0]
                $('#id-h1-song-title>i').text(title)
                return `music/${songList[0]}`
            }
            var title = titleList(songList)[i + 1]
            $('#id-h1-song-title>i').text(title)
            return `music/${songList[i + 1]}`
        }
    }
}
var prevSong = function() {
    var activeSrc = $('#id-audio-player').attr('src')
    var nowsrc = prevSrc(activeSrc)
    log('播放上一首--->', nowsrc)
    var player = $('#id-audio-player')[0]
    player.autoplay = !player.paused
    player.src = nowsrc
}
var nextSong = function() {
    var activeSrc = $('#id-audio-player').attr('src')
    var nowsrc = nextSrc(activeSrc)
    log('播放下一首--->', nowsrc)
    var player = $('#id-audio-player')[0]
    player.autoplay = !player.paused
    player.src = nowsrc
}

// 设置滑块 时间进度
var setSlider = function(value) {
    var v = value * 100
    $('#id-input-slider').val(v)
}
var nChar = function(char, n) {
    var s = ''
    for (var i = 0; i < n; i++) {
        s += char
    }
    return s
}
var zfill = function(n, width) {
    var s = String(n)
    var len = s.length
    return nChar('0', width - len) + s
}
var labelFromTime = function(time) {
    var minutes = zfill(Math.floor(time / 60),2)
    var seconds = zfill(Math.floor(time % 60),2)
    var t = `${minutes}:${seconds}`
    return t
}
var bindAudioEvents = function() {
    $('#id-audio-player').on('timeupdate', function(e){
        var player = e.target
        // 设置 播放比例
        var value = player.currentTime / player.duration
        setSlider(value)
        var time = labelFromTime(player.currentTime)
        $('#id-time-current').text(time)
    })
    // 音乐播放完了之后的时间
    $("#id-audio-player").on('ended', function(e){
        log('播放模式', playerMode)
        // 根据播放模式来播放下一首
    })
    // 加载音乐后的事件
    $('#id-audio-player').on('canplay', function(e){
        var player = e.target
        log('can play', player.duration)
        var time = labelFromTime(player.duration)
        // 滑条归位， 时间重置
        $('#id-input-slider').val(0)
        $('#id-time-current').text('00:00')
        $('#id-time-duration').text(time)
    })
}
bindAudioEvents()


var playSong = function(button) {
    $('#id-audio-player')[0].play()
    button.dataset.action = 'pause'
    $(button).removeClass("fa-play").addClass("fa-pause")
    log('button',button)
}
var pauseSong = function(button) {
    $('#id-audio-player')[0].pause()
    button.dataset.action = 'play'
    $(button).removeClass("fa-pause").addClass("fa-play")
    log('button',button)
}
var bindPlayEvents = function() {
    $('.player-play').on('click', '.player-button', function(event) {
        var button = event.target
        var type = button.dataset.action
        var actions = {
            prev: prevSong,
            next: nextSong,
            play: playSong,
            pause: pauseSong,
        }
        var action = actions[type]
        action(button)
    })
}
bindPlayEvents()

var bindSwitch = function() {
    var player = $('#id-audio-player')[0]
    // 点击切换歌曲
    $('.song').on('click', function(e){
        var self = $(e.target)
        var song = self.text()
        log('click', song)
        // 根据当前播放状态设置 autoplay
        player.autoplay = !player.paused
        log('player.autoplay',!player.paused)
        // 切换歌曲
        player.src = `music/${song}.mp3`
        log('duration', player.duration)
        // 设置当前歌曲名称
        $('#id-h1-song-title>i').text(song)
    })
}
bindSwitch()
