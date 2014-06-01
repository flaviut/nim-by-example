# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

class CodeClassSimplfier < Nanoc::Filter
  identifier :code_class_simplfier
  type :text

  def run(content, params={})
    return content.dup.gsub!(/"language-\w+?"/, "codehilite")
  end

end