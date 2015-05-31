def all_js(files)
  js_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/assets/js/#{file}/"}
    puts "File #{file} doesn't exist!" unless item
    js_arr << item.compiled_content
  end
  js_arr.join("\n")
end

def all_css(files)
  css_arr = []
  for file in files
    item = @items.find{|i| i.identifier == "/assets/css/#{file}/"}
    puts "File #{file} doesn't exist!" unless item
    css_arr << item.compiled_content
  end
  css_arr.join("\n")
end
