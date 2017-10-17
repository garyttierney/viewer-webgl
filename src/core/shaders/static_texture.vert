attribute vec4 position;
attribute vec4 inputTexCoord;

varying vec2 texCoord;

void main()
{
    gl_Position = position;
    texCoord = inputTexCoord.xy;
}